const requireGlobal = (name) => {
  const value = globalThis[name];
  if (typeof value !== 'function' && name !== 'vi') {
    throw new Error(`Vitest shim: global ${name} is not available.`);
  }
  return value;
};

export const describe = (...args) => requireGlobal('describe')(...args);
export const it = (...args) => requireGlobal('it')(...args);
export const test = (...args) => requireGlobal('test')(...args);
export const beforeEach = (...args) => requireGlobal('beforeEach')(...args);
export const afterEach = (...args) => requireGlobal('afterEach')(...args);
export const expect = (...args) => requireGlobal('expect')(...args);
export const vi = globalThis.vi;

export default {
  describe,
  it,
  test,
  beforeEach,
  afterEach,
  expect,
  vi,
};
