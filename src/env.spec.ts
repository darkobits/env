import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import type { Env } from './env';


describe('env', () => {
  let env: Env;

  beforeEach(async () => {
    vi.resetModules();
    env = (await import('./env')).default;
  });

  describe('when provided a non-string argument', () => {
    it('should throw an error', () => {
      expect(() => {
        // @ts-ignore
        env();
      }).toThrow('[env] Expected first argument to be of type "string"');
    });
  });

  interface Foo {
    [index: string]: any;
    bar: string;
  }

  describe('when "process" is not defined', () => {
    let ORIG_PROCESS: NodeJS.Process;

    beforeEach(() => {
      ORIG_PROCESS = process;
      Reflect.deleteProperty(global, 'process');
    });

    it('should throw an error', () => {
      expect.assertions(1);

      try {
        const foo = env<Foo>('foo');
        console.log(foo);
      } catch (err: any) {
        expect(err?.message).toBe('[env] Global "process" does not exist.');
      }
    });

    afterEach(() => {
      global.process = ORIG_PROCESS;
    });
  });

  describe('when "process" is a non-object', () => {
    let ORIG_PROCESS: NodeJS.Process;

    beforeEach(() => {
      ORIG_PROCESS = process;
      // @ts-ignore
      process = true; // eslint-disable-line no-global-assign
    });

    it('should throw an error', () => {
      expect.assertions(1);

      try {
        env('foo');
      } catch (err: any) {
        expect(err?.message).toMatch('[env] Expected "process" to be of type "object"');
      }
    });

    afterEach(() => {
      global.process = ORIG_PROCESS;
    });
  });

  describe('when "process.env" is not defined', () => {
    let ORIG_ENV: NodeJS.ProcessEnv;

    beforeEach(() => {
      ORIG_ENV = process.env;
      Reflect.deleteProperty(process, 'env');
    });

    it('should throw an error', () => {
      expect(() => {
        env('foo');
      }).toThrow('[env] "env" does not exist in object "process".');
    });

    afterEach(() => {
      process.env = ORIG_ENV;
    });
  });

  describe('when "process.env" is a non-object', () => {
    let ORIG_ENV: NodeJS.ProcessEnv;

    beforeEach(() => {
      ORIG_ENV = process.env;
      // @ts-ignore
      process.env = true;
    });

    it('should throw an error', () => {
      expect(() => {
        env('foo');
      }).toThrow('[env] Expected "process.env" to be of type "object"');
    });

    afterEach(() => {
      process.env = ORIG_ENV;
    });
  });

  describe('when strict is `true` and the requested variable is not defined', () => {
    it('should throw an error', () => {
      const variableName = '___UNDEFINED___';
      expect(() => {
        env(variableName, true);
      }).toThrow(`[env] (Strict) "${variableName}" does not exist in object "process.env".`);
    });
  });

  describe('when the requested variable is a number-like string', () => {
    it('should return a number', () => {
      const key = '__NUMBER_TEST__';
      const value = '3.14';
      const parsedValue = Number(value);

      process.env[key] = value;

      expect(env(key)).toBe(parsedValue);
    });
  });

  describe('when the requested variable is the string "true"', () => {
    it('should return the boolean value true', () => {
      const key = '__TRUE_TEST__';
      const value = 'true';

      process.env[key] = value;

      expect(env(key)).toBe(true);
    });
  });

  describe('when the requested variable is the string "false"', () => {
    it('should return the boolean value false', () => {
      const key = '__FALSE_TEST__';
      const value = 'false';

      process.env[key] = value;

      expect(env(key)).toBe(false);
    });
  });

  describe('when the requested variable is a serialized JSON blob', () => {
    it('should return the de-serialized value', () => {
      const key = '__JSON_TEST__';
      const value = {
        foo: 'bar',
        baz: 'qux'
      };

      process.env[key] = JSON.stringify(value);

      expect(env(key)).toMatchObject(value);
    });
  });

  describe('when the requested variable is a generic string', () => {
    it('should return the requested variable', () => {
      const key = '__STRING_TEST__';
      const value = 'kittens';

      process.env[key] = value;

      expect(env(key)).toBe(value);
    });
  });
});


describe('env.has', () => {
  let env: Env;

  beforeEach(async () => {
    vi.resetModules();
    env = (await import('./env')).default;
  });

  it('should return `true` when the provided variable exists', () => {
    const key = '___HAS_TRUE_TEST__';
    const value = 'kittens';

    process.env[key] = value;

    // @ts-ignore
    expect(env.has(key)).toBe(true);
  });

  it('should return `false` when the provided variable does not exist', () => {
    const key = '___HAS_FALSE_TEST__';

    // @ts-ignore
    expect(env.has(key)).toBe(false);
  });
});


describe('env.eq', () => {
  let env: Env;

  beforeEach(async () => {
    vi.resetModules();
    env = (await import('./env')).default;
  });

  it('should return `true` when the provided variable equals the provided value', () => {
    const key = '___EQ_TRUE_TEST___';
    const value = 'kittens';

    process.env[key] = value;

    expect(env.eq(key, value)).toBe(true);
  });

  it('should return `false` when the provided variable does not exist', () => {
    const key = '___EQ_FALSE_TEST___';
    const value = 'kittens';

    process.env[key] = value;

    expect(env.eq(key, 'bar')).toBe(false);
  });

  describe('comparing against non-primitives', () => {
    it('should serialize values when comparing them', () => {
      const key = '___EQ_OBJECT_TEST___';
      const value = {foo: 'bar', baz: true, bar: vi.fn()};

      process.env[key] = JSON.stringify(value);

      expect(env.eq(key, value)).toBe(true);
    });
  });
});
