#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { createRequire } from "node:module";

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

const cwd = process.cwd();
const argv = process.argv.slice(2);
const passWithNoTests = argv.includes("--passWithNoTests");

function logSummary(total, failed) {
  const passed = total - failed;
  if (failed === 0) {
    console.log(`\nTest Suites: ${passed} passed, ${total} total`);
  } else {
    console.log(`\nTest Suites: ${passed} passed, ${failed} failed, ${total} total`);
  }
}

async function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return {
      roots: [path.join(cwd, "src")],
      setupFilesAfterEnv: [],
    };
  }
  const result = await build({
    entryPoints: [configPath],
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "es2020",
    write: false,
    loader: { ".ts": "ts", ".tsx": "tsx" },
    jsx: "automatic",
    tsconfig: path.join(cwd, "tsconfig.json"),
  });
  const output = result.outputFiles?.[0]?.text ?? "";
  const mod = { exports: {} };
  const req = createRequire(pathToFileURL(configPath));
  const fn = new Function(
    "require",
    "module",
    "exports",
    "__dirname",
    "__filename",
    output,
  );
  fn(req, mod, mod.exports, path.dirname(configPath), configPath);
  return mod.exports?.default ?? mod.exports;
}

function resolveRoot(value, rootDir) {
  return value.replace(/<rootDir>/g, rootDir);
}

function isTestFile(file) {
  return /(\.test\.|\.spec\.).*(t|j)sx?$/i.test(file);
}

function collectFromDir(dir, acc) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      collectFromDir(full, acc);
    } else if (entry.isFile() && isTestFile(entry.name)) {
      acc.push(full);
    }
  }
}

function discoverTests(roots, rootDir) {
  const found = [];
  for (const root of roots) {
    const resolved = resolveRoot(root, rootDir);
    collectFromDir(resolved, found);
  }
  return found.sort();
}

function deepEqual(a, b, seen = new Set()) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  const pair = `${a}__${b}`;
  if (seen.has(pair)) return true;
  seen.add(pair);
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], seen)) return false;
  }
  return true;
}

function createExpect() {
  const matchers = {
    toBe(received, expected) {
      if (!Object.is(received, expected)) {
        throw new AssertionError(`Expected ${received} to be ${expected}`);
      }
    },
    toEqual(received, expected) {
      if (!deepEqual(received, expected)) {
        throw new AssertionError("Expected values to be deeply equal");
      }
    },
    toStrictEqual(received, expected) {
      if (!deepEqual(received, expected)) {
        throw new AssertionError("Expected values to be strictly equal");
      }
    },
    toBeDefined(received) {
      if (typeof received === "undefined") {
        throw new AssertionError("Expected value to be defined");
      }
    },
    toBeGreaterThan(received, value) {
      if (!(received > value)) {
        throw new AssertionError(`Expected ${received} > ${value}`);
      }
    },
    toBeGreaterThanOrEqual(received, value) {
      if (!(received >= value)) {
        throw new AssertionError(`Expected ${received} >= ${value}`);
      }
    },
    toBeLessThan(received, value) {
      if (!(received < value)) {
        throw new AssertionError(`Expected ${received} < ${value}`);
      }
    },
    toBeLessThanOrEqual(received, value) {
      if (!(received <= value)) {
        throw new AssertionError(`Expected ${received} <= ${value}`);
      }
    },
    toBeCloseTo(received, expected, precision = 2) {
      const diff = Math.abs(received - expected);
      const pass = diff < Math.pow(10, -precision) / 2;
      if (!pass) {
        throw new AssertionError(`Expected ${received} to be close to ${expected}`);
      }
    },
    toBeTruthy(received) {
      if (!received) {
        throw new AssertionError("Expected value to be truthy");
      }
    },
  };

  const expectFn = (received) => {
    const api = {};
    for (const [name, fn] of Object.entries(matchers)) {
      api[name] = (...args) => fn(received, ...args);
    }
    api.not = {};
    for (const [name, fn] of Object.entries(matchers)) {
      api.not[name] = (...args) => {
        try {
          fn(received, ...args);
        } catch (err) {
          if (err instanceof AssertionError) {
            return;
          }
          throw err;
        }
        throw new AssertionError(`Expected matcher ${name} to fail`);
      };
    }
    return api;
  };

  return expectFn;
}

function createRuntime() {
  const tests = [];
  const beforeEachHooks = [];
  const afterEachHooks = [];
  const beforeAllHooks = [];
  const afterAllHooks = [];
  const stack = [];
  const expectFn = createExpect();

  const pushTest = (name, fn) => {
    const fullName = [...stack, name].join(" › ");
    tests.push({ name: fullName, fn });
  };

  const describeFn = (name, fn) => {
    stack.push(name);
    try {
      fn();
    } finally {
      stack.pop();
    }
  };
  const registerTest = (name, fn) => pushTest(name, fn);
  const skip = () => {};
  globalThis.describe = Object.assign(describeFn, {
    only: (name, fn) => describeFn(name, fn),
    skip,
  });
  globalThis.it = Object.assign(registerTest, {
    only: (name, fn) => registerTest(name, fn),
    skip,
  });
  globalThis.test = globalThis.it;
  globalThis.beforeEach = (fn) => {
    beforeEachHooks.push(fn);
  };
  globalThis.afterEach = (fn) => {
    afterEachHooks.push(fn);
  };
  globalThis.beforeAll = (fn) => {
    beforeAllHooks.push(fn);
  };
  globalThis.afterAll = (fn) => {
    afterAllHooks.push(fn);
  };
  globalThis.expect = expectFn;

  return {
    async run() {
      for (const hook of beforeAllHooks) {
        await hook();
      }
      let failed = 0;
      for (const test of tests) {
        try {
          for (const hook of beforeEachHooks) {
            await hook();
          }
          const value = test.fn();
          if (value && typeof value.then === "function") {
            await value;
          }
          for (const hook of afterEachHooks) {
            await hook();
          }
          console.log(`✓ ${test.name}`);
        } catch (err) {
          failed += 1;
          console.error(`✗ ${test.name}`);
          if (err instanceof Error) {
            console.error(err.stack || err.message);
          } else {
            console.error(err);
          }
        }
      }
      for (const hook of afterAllHooks) {
        await hook();
      }
      return { total: tests.length, failed };
    },
    cleanup() {
      delete globalThis.describe;
      delete globalThis.it;
      delete globalThis.test;
      delete globalThis.beforeEach;
      delete globalThis.afterEach;
      delete globalThis.beforeAll;
      delete globalThis.afterAll;
      delete globalThis.expect;
    },
  };
}

async function executeModule(filePath) {
  const result = await build({
    entryPoints: [filePath],
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "es2020",
    write: false,
    jsx: "automatic",
    loader: { ".ts": "ts", ".tsx": "tsx" },
    tsconfig: path.join(cwd, "tsconfig.json"),
    sourcemap: "inline",
    define: {
      "process.env.NODE_ENV": '"test"',
    },
  });
  const code = result.outputFiles?.[0]?.text ?? "";
  const module = { exports: {} };
  const req = createRequire(pathToFileURL(filePath));
  const fn = new Function(
    "require",
    "module",
    "exports",
    "__dirname",
    "__filename",
    code,
  );
  fn(req, module, module.exports, path.dirname(filePath), filePath);
  return module.exports;
}

async function runSetupFiles(files, rootDir) {
  for (const entry of files ?? []) {
    const resolved = resolveRoot(entry, rootDir);
    await executeModule(resolved);
  }
}

async function run() {
  const configPath = path.join(cwd, "jest.config.ts");
  const config = await loadConfig(configPath);
  const roots = config.roots ?? [path.join(cwd, "src")];
  const tests = discoverTests(roots, cwd);

  if (tests.length === 0) {
    console.log("No tests found.");
    if (passWithNoTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }

  await runSetupFiles(config.setupFilesAfterEnv ?? [], cwd);

  let total = 0;
  let failed = 0;
  for (const file of tests) {
    const runtime = createRuntime();
    try {
      await executeModule(file);
      const result = await runtime.run();
      total += result.total;
      failed += result.failed;
    } finally {
      runtime.cleanup();
    }
  }

  logSummary(total, failed);

  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
