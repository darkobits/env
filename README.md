<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/41958963-805c3a9e-79a0-11e8-91c1-2531f78cf467.png" style="max-width: 100%">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/env"><img src="https://img.shields.io/npm/v/@darkobits/env.svg?style=flat-square"></a>
  <a href="https://travis-ci.com/github/darkobits/env"><img src="https://img.shields.io/travis/com/darkobits/env?style=flat-square"></a>
  <a href="https://www.codacy.com/app/darkobits/env"><img src="https://img.shields.io/codacy/coverage/728590ddfc4d4658a170e37cd5d1b5d8.svg?style=flat-square"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/conventional%20commits-1.0.0-FB5E85.svg?style=flat-square"></a>
</p>

A functional getter/parser for `process.env`.

## Features

- Encourages just-in-time retrieval of environment variables.
- Casts number-like values to numbers.
- Casts `"true"` and `"false"` to booleans.
- Parses JSON.
- Throws if `process` or `process.env` are non-objects.
- (Optional) Throw if a variable is undefined.

## Install

```bash
$ npm i @darkobits/env
```

## Use

This package's default export is a function with the following signature:

```ts
interface Env {
  (variableName: string, strict: boolean = false): any;
  has(variableName: string): boolean;
  eq(variableName: string, value: any, strict: boolean = false): boolean;
}
```

Keeping in mind that the values in `process.env` [may only be strings](https://nodejs.org/api/process.html#process_process_env), let's assume `process.env` looks like this:

```json
{
  "FOO": "foo",
  "BAR": "42",
  "BAZ": "true",
  "QUX": "false",
  "JSON": "{\"kittens\": true}"
}
```

```ts
import env from '@darkobits/env';

env('FOO')         //=> 'foo'
typeof env('FOO')  //=> 'string'

env('BAR')         //=> 42
typeof env('BAR')  //=> 'number'

env('BAZ')         //=> true
typeof env('BAZ')  //=> 'boolean'

env('QUX')         //=> false
typeof env('BAZ')  //=> 'boolean'

env('JSON')        //=> {kittens: true}
typeof env('JSON') //=> 'object'

env('NOAP')        //=> undefined
env('NOAP', true)  //=> throws

// Throws if process.env has been tampered-with.
process.env = null;
env('FOO')         //=> throws

// Throws if process has been tampered-with, or if process doesn't exist.
process = null;
env('FOO')         //=> throws
```

### `env.has`

This helper predicate is a shorthand for `Object.keys(process.env).includes(x)`. It returns `true` if the provided variable name exists in `process.env` and `false` otherwise. Useful when you don't care what the value of a variable is, only whether it is set or not.

Using our example `process.env` object from above:

```ts
env.has('FOO') //=> true
env.has('UNICORNS') //=> false
```

### `env.eq`

This helper predicate is a shorthand for `env(variableName) === value`. It returns `true` if the provided variable name exists in `process.env` and is equal to the provided value and `false` otherwise. Useful when you need to quickly test the value of an environment variable. A third `strict` argument may be set to `true` to cause `env.eq` to throw if the provided variable does not exist in `process.env`.

**Note:** When comparing against non-primitives (objects, arrays), env.eq will serialize the provided `value` and compare it against the serialized (re: string) form of the environment variable.

Using our example `process.env` object from above:

```ts
import env from '@darkobits/env';

env.eq('FOO', 'foo') //=> true
env.eq('BAR', 42)    //=> true
env.eq('BAR', null)  //=> false
env.eq('BAZ', true)  //=> true
env.eq('JSON', {kittens: true}) //=> true
```

<a href="#top">
  <img src="https://user-images.githubusercontent.com/441546/69777002-41ac7380-1153-11ea-85a4-88184f8c9975.png" style="max-width: 100%;">
</a>
