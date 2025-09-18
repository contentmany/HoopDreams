#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { createExpect } from '../src/expect.js';

function setupTsCompiler(projectRoot, ts) {
  const compilerOptions = {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    target: ts.ScriptTarget.ES2020,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    skipLibCheck: true,
    sourceMap: false,
  };
  const extensions = ['.ts', '.tsx'];
  for (const ext of extensions) {
    Module._extensions[ext] = (module, filename) => {
      const code = fs.readFileSync(filename, 'utf8');
      const output = ts.transpileModule(code, { compilerOptions, fileName: filename });
      module._compile(output.outputText, filename);
    };
  }

  const originalResolve = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, isMain, options) {
    const vendor = mapVendorModule(projectRoot, request);
    if (vendor) {
      return originalResolve.call(this, vendor, parent, isMain, options);
    }
    if (typeof request === 'string' && request.startsWith('@/')) {
      const resolved = resolveAlias(projectRoot, request.slice(2));
      if (resolved) {
        return originalResolve.call(this, resolved, parent, isMain, options);
      }
    }
    return originalResolve.call(this, request, parent, isMain, options);
  };
}

function mapVendorModule(projectRoot, request) {
  const vendorMap = {
    react: path.join(projectRoot, 'vendor/react/index.js'),
    'react/jsx-runtime': path.join(projectRoot, 'vendor/react/jsx-runtime.js'),
    'react-dom/server': path.join(projectRoot, 'vendor/react-dom/server.js'),
  };
  return vendorMap[request] ?? null;
}

function resolveAlias(projectRoot, specifier) {
  const base = path.join(projectRoot, 'src', specifier);
  return resolveWithExtensions(base);
}

function resolveWithExtensions(basePath) {
  const attempts = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
  ];
  for (const attempt of attempts) {
    if (fs.existsSync(attempt) && fs.statSync(attempt).isFile()) {
      return attempt;
    }
  }
  return null;
}

async function loadTypeScript() {
  try {
    const mod = await import('typescript');
    return mod.default ?? mod;
  } catch (error) {
    const execDir = path.dirname(process.execPath);
    const tsPath = path.join(execDir, '..', 'lib', 'node_modules', 'typescript', 'lib', 'typescript.js');
    if (fs.existsSync(tsPath)) {
      const mod = await import(pathToFileURL(tsPath));
      return mod.default ?? mod;
    }
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  let watch = false;
  let reporter = 'default';
  const positionals = [];

  for (const arg of args) {
    if (arg === '--watch' || arg === '-w') {
      watch = true;
    } else if (arg.startsWith('--reporter=')) {
      reporter = arg.split('=')[1] ?? reporter;
    } else if (!arg.startsWith('-')) {
      positionals.push(arg);
    }
  }

  const mode = positionals[0] ?? 'run';

  if (mode !== 'run') {
    console.warn(`Unsupported command "${mode}" – running tests once.`);
  }

  if (watch) {
    console.warn('Watch mode is not implemented in this Vitest shim. Running tests once.');
  }

  const projectRoot = process.cwd();
  const ts = await loadTypeScript();
  setupTsCompiler(projectRoot, ts);
  const requireFromRoot = Module.createRequire(path.join(projectRoot, 'package.json'));
  const setupFile = path.join(projectRoot, 'src/test/setup.ts');
  const testRoot = path.join(projectRoot, 'src');
  const testFiles = collectTestFiles(testRoot);

  if (testFiles.length === 0) {
    console.log('Vitest shim: no test files discovered.');
    process.exit(0);
  }

  let totalPassed = 0;
  let totalFailed = 0;
  const failureDetails = [];

  for (const file of testFiles) {
    const runner = new TestFileRunner({
      file,
      projectRoot,
      reporter,
      setupFile,
      requireFromRoot,
    });
    const result = await runner.run();
    totalPassed += result.passed;
    totalFailed += result.failed;
    failureDetails.push(...result.failures);
  }

  const totalTests = totalPassed + totalFailed;
  if (reporter === 'dot') {
    process.stdout.write(`\n${totalTests} tests: ${totalPassed} passed, ${totalFailed} failed.\n`);
  } else {
    console.log(`\nTest run complete. Files: ${testFiles.length}, Passed: ${totalPassed}, Failed: ${totalFailed}`);
  }

  if (failureDetails.length > 0) {
    for (const failure of failureDetails) {
      console.log(`\n${failure.fullName}`);
      if (failure.error?.stack) {
        console.log(failure.error.stack);
      } else if (failure.error?.message) {
        console.log(failure.error.message);
      } else {
        console.log(String(failure.error));
      }
    }
    process.exit(1);
  }

  process.exit(0);
}

class TestFileRunner {
  constructor({ file, projectRoot, reporter, setupFile, requireFromRoot }) {
    this.file = file;
    this.projectRoot = projectRoot;
    this.reporter = reporter;
    this.setupFile = fs.existsSync(setupFile) ? setupFile : null;
    this.requireFromRoot = requireFromRoot;
    this.tests = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
    this.onlyMode = false;
    this.failures = [];
    this.passed = 0;
    this.failed = 0;
  }

  registerGlobals() {
    const expect = createExpect();
    const self = this;

    function registerTest(name, fn, mode = 'run') {
      const fullName = self.suiteStack.length > 0 ? `${self.suiteStack.join(' ')} ${name}`.trim() : name;
      const record = { name, fullName, fn, mode };
      self.tests.push(record);
      if (mode === 'only') self.onlyMode = true;
    }

    const test = (name, fn) => registerTest(name, fn);
    test.only = (name, fn) => registerTest(name, fn, 'only');
    test.skip = (name, fn) => registerTest(name, fn, 'skip');

    const describe = (name, fn, mode = 'run') => {
      if (mode === 'skip') return;
      self.suiteStack.push(name);
      try {
        fn();
      } finally {
        self.suiteStack.pop();
      }
    };
    describe.only = (name, fn) => {
      self.onlyMode = true;
      describe(name, fn);
    };
    describe.skip = (name, fn) => describe(name, fn, 'skip');

    globalThis.test = test;
    globalThis.it = test;
    globalThis.describe = describe;
    globalThis.beforeEach = (fn) => self.beforeEachHooks.push(fn);
    globalThis.afterEach = (fn) => self.afterEachHooks.push(fn);
    globalThis.expect = expect;
    globalThis.vi = createVi();
  }

  unregisterGlobals() {
    for (const key of ['test', 'it', 'describe', 'beforeEach', 'afterEach', 'expect', 'vi']) {
      delete globalThis[key];
    }
  }

  installDom() {
    const { JSDOM } = this.requireFromRoot('jsdom');
    this.dom = new JSDOM('<!doctype html><html><body></body></html>');
    const window = this.dom.window;
    globalThis.window = window;
    globalThis.document = window.document;
    globalThis.HTMLElement = window.HTMLElement;
    globalThis.Node = window.Node;
    globalThis.navigator = window.navigator;
    globalThis.getComputedStyle = window.getComputedStyle;
    globalThis.requestAnimationFrame = window.requestAnimationFrame;
    globalThis.cancelAnimationFrame = window.cancelAnimationFrame;
  }

  cleanupDom() {
    if (this.dom?.window?.close) {
      this.dom.window.close();
    }
    for (const key of ['window', 'document', 'HTMLElement', 'Node', 'navigator', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
      delete globalThis[key];
    }
  }

  async run() {
    this.tests = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
    this.suiteStack = [];
    this.onlyMode = false;

    this.registerGlobals();
    this.installDom();

    if (this.setupFile) {
      await this.executeModule(this.setupFile);
    }

    await this.executeModule(this.file);

    const testsToRun = this.onlyMode ? this.tests.filter((t) => t.mode === 'only') : this.tests.filter((t) => t.mode !== 'skip');

    if (testsToRun.length === 0) {
      this.unregisterGlobals();
      this.cleanupDom();
      return { passed: 0, failed: 0, failures: [] };
    }

    if (this.reporter === 'dot') {
      process.stdout.write(`\n${path.relative(this.projectRoot, this.file)}\n`);
    } else {
      console.log(`\nFile: ${path.relative(this.projectRoot, this.file)}`);
    }

    for (const test of testsToRun) {
      const start = performance.now();
      try {
        for (const hook of this.beforeEachHooks) {
          await hook();
        }
        await runMaybeAsync(test.fn);
        for (const hook of this.afterEachHooks) {
          await hook();
        }
        this.passed += 1;
        if (this.reporter === 'dot') {
          process.stdout.write('.');
        } else {
          const duration = (performance.now() - start).toFixed(1);
          console.log(`  ✓ ${test.fullName} (${duration}ms)`);
        }
      } catch (error) {
        this.failed += 1;
        if (this.reporter === 'dot') {
          process.stdout.write('F');
        } else {
          console.log(`  ✗ ${test.fullName}`);
        }
        this.failures.push({ test, error, fullName: test.fullName });
      }
    }

    if (this.reporter === 'dot') {
      process.stdout.write('\n');
    }

    this.unregisterGlobals();
    this.cleanupDom();

    return { passed: this.passed, failed: this.failed, failures: this.failures };
  }

  async executeModule(file) {
    const localRequire = Module.createRequire(file);
    return localRequire(file);
  }
}

function collectTestFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(collectTestFiles(full));
    } else if (/\.(test|spec)\.[tj]sx?$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function createVi() {
  const timers = new Set();
  return {
    fn(impl = () => undefined) {
      const mockFn = (...args) => {
        mockFn.mock.calls.push(args);
        return impl(...args);
      };
      mockFn.mock = { calls: [] };
      mockFn.mockImplementation = (nextImpl) => {
        impl = nextImpl;
        return mockFn;
      };
      mockFn.mockReturnValue = (value) => {
        impl = () => value;
        return mockFn;
      };
      return mockFn;
    },
    useFakeTimers() {},
    useRealTimers() {},
    clearAllTimers() {
      for (const id of timers) {
        clearTimeout(id);
      }
      timers.clear();
    },
  };
}

async function runMaybeAsync(fn) {
  const value = fn();
  if (value && typeof value.then === 'function') {
    return await value;
  }
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
