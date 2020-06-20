# 📦 wasmwrap
**Wrap WASM into JS files as base64.**

This command line tool generates a typescript or a javascript file that you can simply import or require in your code, it plays nice with any bundler such as Webpack or Rollup.

Useful for shipping small WebAssembly libraries, in testing, and as a build step after generating `.wasm` files.

## Installation
```
npm install --save wasmwrap
```

## Usage
```
$ wasmwrap --help
Options:
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]
  --input           Input filepath to wrap, can be any file. [string] [required]
  --output          Where to write the output, if not specified it prints the
                    file contents to STDOUT.                            [string]
  --language        language of output file, by default it looks at the output
                    filename.  [choices: "js", "ts", "match"] [default: "match"]
  --module          module type to generate, only necessary to change if you are
                    using an old node version.
                                   [choices: "esm", "commonjs"] [default: "esm"]
  --include-decode  include a base64 decode function that works both in the
                    browser and in node/deno (~1KB unminified).
                                                       [boolean] [default: true]
```

### Examples

#### Generate JS file
```
wasmwrap --input myfile.wasm --output myfile.wasm.js 
```

#### Generate Typescript file
```
wasmwrap --input myfile.wasm --output myfile.wasm.ts
```

### Advanced

#### Excluding the decode function
By default the generated file contains a base64 decode function that works in both the browser, node or deno. If you wish to exclude this and use your own you can specify `--no-include-decode`.

#### CommonJS module output
If you are using an old Node version you can instead generate a CommonJS module by passing `--module=commonjs`.

## Motivation - Why not use a bundler for wrapping wasm?
Wrapping WebAssembly into a Javascript or Typescript file is something that you can do using various bundler plugins (such as my own [`rollup-plugin-base64`](https://github.com/gzuidhof/rollup-plugin-base64)), but for a lot of projects a bundler is overkill, or perhaps you need more control.

Using a bundler also leads to a more difficult testing story here: how do you test code that first requires the bundle step?

With this small but sharp tool you can add this as a build step right after you generate the `.wasm` or `.wat` file and generate a JS or TS file that you can then import. You can then still use your bundler without any special WebAssembly plugins.
