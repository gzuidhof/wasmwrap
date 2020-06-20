#!/usr/bin/env node
import {renderCode, RenderData} from "./codegen";
import * as yargs from "yargs";
import fs from "fs";

type ModuleOutputArg = 'esm' | 'commonjs';
const moduleOptions: ReadonlyArray<ModuleOutputArg> = ['esm', 'commonjs'];

type LanguageArg = 'js' | 'ts' | "match";
const languageOptions: ReadonlyArray<LanguageArg> = ['js', 'ts', "match"];

function main() {
    const opts = yargs.options({
        "input": {type: "string", demandOption: true, description: 'Input filepath to wrap, can be any file.'},
        "output": {type: "string", description: 'Where to write the output, if not specified it prints the file contents to STDOUT.'},
        "language": {choices: languageOptions, default: "match", description: 'language of output file, by default it looks at the output filename.'},
        "module": {choices: moduleOptions, default: "esm", description: 'module type to generate, only necessary to change if you are using an old node version.'},
        "include-decode": {type: "boolean", default: true, description: 'include a base64 decode function that works both in the browser and in node/deno (~1KB unminified).'},
    }).argv

    // Read input file 
    const inFilePath = opts.input;
    const fileContents = fs.readFileSync(inFilePath)

    if (opts.language === "match") {
        if (opts.output !== undefined && opts.output.endsWith(".ts")) {
            opts.language = "ts"
        } else {
            opts.language = "js"
        }
    }

    const renderData: RenderData = {
        base64Wasm: fileContents.toString('base64'),
        module: opts.module as ModuleOutputArg,
        includeDecode: opts["include-decode"],
        typescript: opts.language === "ts",
    }
    const outFileContents = renderCode(renderData);

    if (opts.output === undefined) {
        console.log(outFileContents);
    } else {
        fs.writeFileSync(opts.output, outFileContents);
    }
}

main();