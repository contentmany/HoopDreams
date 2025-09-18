declare type DoneFn = () => void;

interface JestMatchers<T> {
  toBe(expected: T): void;
  toEqual(expected: unknown): void;
  toStrictEqual(expected: unknown): void;
  toBeDefined(): void;
  toBeGreaterThan(expected: number): void;
  toBeGreaterThanOrEqual(expected: number): void;
  toBeLessThan(expected: number): void;
  toBeLessThanOrEqual(expected: number): void;
  toBeCloseTo(expected: number, precision?: number): void;
  toBeTruthy(): void;
  not: JestMatchers<T>;
}

declare function expect<T>(actual: T): JestMatchers<T>;

declare function describe(name: string, fn: () => void): void;
declare namespace describe {
  function only(name: string, fn: () => void): void;
  function skip(name: string, fn: () => void): void;
}

declare function test(name: string, fn: () => void | Promise<void>): void;
declare namespace test {
  function only(name: string, fn: () => void | Promise<void>): void;
  function skip(name: string, fn: () => void | Promise<void>): void;
}

declare const it: typeof test;

declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;
declare function beforeAll(fn: () => void | Promise<void>): void;
declare function afterAll(fn: () => void | Promise<void>): void;

export { expect, describe, test, it, beforeEach, afterEach, beforeAll, afterAll };
