<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/41958963-805c3a9e-79a0-11e8-91c1-2531f78cf467.png" style="max-width: 100%">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/env"><img src="https://img.shields.io/npm/v/@darkobits/env.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/darkobits/env"><img src="https://img.shields.io/travis/darkobits/env.svg?style=flat-square"></a>
  <a href="https://www.codacy.com/app/darkobits/env"><img src="https://img.shields.io/codacy/coverage/728590ddfc4d4658a170e37cd5d1b5d8.svg?style=flat-square"></a>
  <a href="https://github.com/conventional-changelog/standard-version"><img src="https://img.shields.io/badge/conventional%20commits-1.0.0-027dc6.svg?style=flat-square"></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-e271a5.svg?style=flat-square"></a>
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
env(variableName: string, strict: boolean = false);
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

This helper is a shorthand for `Object.keys(process.env).includes(x)`. It returns `true` if the provided variable name exists in `process.env` and `false` otherwise. Useful when you don't care what the value of a variable is, only whether it is set or not.

## &nbsp;
<p align="center">
  <br>
  <img width="22" height="22" src="https://cloud.githubusercontent.com/assets/441546/25318539/db2f4cf2-2845-11e7-8e10-ef97d91cd538.png">
</p>
