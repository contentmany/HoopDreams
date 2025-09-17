import { isDeepStrictEqual } from 'node:util';

const defaultMatchers = {
  toBe(received, expected) {
    const pass = Object.is(received, expected);
    return {
      pass,
      message: () => `Expected ${formatValue(received)} to be ${formatValue(expected)}`,
    };
  },
  toEqual(received, expected) {
    const pass = isDeepStrictEqual(received, expected);
    return {
      pass,
      message: () => `Expected ${formatValue(received)} to equal ${formatValue(expected)}`,
    };
  },
  toBeTruthy(received) {
    const pass = !!received;
    return {
      pass,
      message: () => `Expected ${formatValue(received)} to be truthy`,
    };
  },
  toBeFalsy(received) {
    const pass = !received;
    return {
      pass,
      message: () => `Expected ${formatValue(received)} to be falsy`,
    };
  },
  toContain(received, expected) {
    const pass = Array.isArray(received)
      ? received.includes(expected)
      : typeof received === 'string'
        ? received.includes(expected)
        : false;
    return {
      pass,
      message: () => `Expected ${formatValue(received)} to contain ${formatValue(expected)}`,
    };
  },
};

function formatValue(value) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

export function createExpect() {
  const matchers = { ...defaultMatchers };

  const expect = (received) => createProxy(received, false);

  expect.extend = (additional) => {
    for (const [name, matcher] of Object.entries(additional || {})) {
      matchers[name] = matcher;
    }
  };

  expect.getState = () => ({
    matchers: { ...matchers },
  });

  function createProxy(received, isNot) {
    const api = {};
    for (const [name, matcher] of Object.entries(matchers)) {
      api[name] = (...expected) => {
        const result = matcher(received, ...expected);
        const pass = isNot ? !result.pass : result.pass;
        const message = typeof result.message === 'function'
          ? result.message
          : () => `Expectation failed: ${name}`;
        if (!pass) {
          throw new Error(message());
        }
      };
    }
    Object.defineProperty(api, 'not', {
      enumerable: false,
      configurable: false,
      get() {
        return createProxy(received, !isNot);
      },
    });
    return api;
  }

  return expect;
}
