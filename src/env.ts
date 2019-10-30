export interface Env {
  /**
   * Accepts an environment variable name. Returns the parsed value of the
   * variable, if it is set.
   *
   * Additionally accepts an optional `strict` argument that, when `true`, will
   * cause env to throw if the provided variable does not exist in process.env.
   */
  (variableName: string, strict?: boolean): any;

  /**
   * Returns `true` if the provided variable name is set and `false` otherwise.
   *
   * Shorthand for `Object.keys(process.env).includes(variableName)`.
   */
  has(variableName: string): boolean;

  /**
   * Accepts a variable name and a value and returns `true` if the variable name
   * is strictly equal to the provided value.
   *
   * Additionally accepts an optional `strict` argument that, when `true`, will
   * cause env.eq to throw if the provided variable does not exist in
   * process.env.
   *
   * Note: When comparing against non-primitives (objects, arrays), env.eq will
   * serialize the provided `value` and compare it against the serialized (re:
   * string) form of the environment variable.
   *
   * Shorthand for `env('SOME_VAR') === testValue`.
   */
  eq(variableName: string, value: any, strict?: boolean): boolean;
}


const env: Env = (variableName, strict = false) => {
  // Throw if first argument is not a string. Although normal objects may have
  // non-string keys (such as Symbols) process.env may not.
  if (typeof variableName !== 'string') { // tslint:disable-line strict-type-predicates
    throw new TypeError(`[env] Expected first argument to be of type "string", got "${typeof variableName}".`);
  }

  // Throw if 'process' does not exist. (User might be in the browser.)
  if (typeof process === 'undefined') { // tslint:disable-line strict-type-predicates no-typeof-undefined
    throw new Error('[env] Global "process" does not exist.');
  }

  // Throw if process is a non-object.
  if (typeof process !== 'object') { // tslint:disable-line strict-type-predicates
    throw new TypeError(`[env] Expected "process" to be of type "object", got "${typeof process}".`);
  }

  // Throw if 'process.env' does not exist.
  if (!Reflect.has(process, 'env')) {
    throw new Error('[env] "env" does not exist in object "process".');
  }

  // Throw if process.env is a non-object.
  if (typeof process.env !== 'object') { // tslint:disable-line strict-type-predicates
    throw new TypeError(`[env] Expected "process.env" to be of type "object", got "${typeof process.env}".`);
  }

  // Throw if in strict mode and the requested variable name does not exist.
  if (strict && !Reflect.has(process.env, variableName)) {
    throw new Error(`[env] (Strict) "${variableName}" does not exist in object "process.env".`);
  }

  try {
    /**
     * If the requested variable is JSON-parse-able, parse it and return it.
     *
     * This will properly convert:
     * - Number-like string values to numbers.
     * - The string value 'true' to the boolean value `true`.
     * - The string value 'false' to the boolean value `false`.
     * - Any serialized data structures to its de-serialized value.
     */
    // @ts-ignore
    return JSON.parse(process.env[variableName]);
  } catch (err) {
    /**
     * If JSON.parse fails, return the value as-is. This will be the case for
     * most string literal values.
     */
    return process.env[variableName];
  }
};


env.has = variableName => {
  return env(variableName) !== undefined;
};


env.eq = (variableName, value, strict = false) => {
  if (typeof value === 'object') {
    return JSON.stringify(value) === JSON.stringify(env(variableName, strict));
  }

  return env(variableName, strict) === value;
};


export default env;
