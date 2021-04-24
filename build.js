#!/usr/bin/env node
"use strict";
//////////////// IMPORTANT ////////////////
// The build.js file is a generated file do not edit it
// If you need to modify the build system please edit the build.ts file
// We commit the generated build.js file because it is much quicker to run and allows to get bash completion from yargs
//////////////////////////////////////////
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const chalk_1 = __importDefault(require("chalk"));
// import { Octokit } from "@octokit/rest";
const shelljs_1 = __importDefault(require("shelljs"));
const path_1 = __importDefault(require("path"));
const concurrently_1 = __importDefault(require("concurrently"));
// Ignore TypeScript warning about unused variable for the helpers
/** @ts-ignore */
const info = chalk_1.default.blueBright;
/** @ts-ignore */
const warn = chalk_1.default.yellow;
/** @ts-ignore */
const error = chalk_1.default.red;
/** @ts-ignore */
const success = chalk_1.default.green;
/** @ts-ignore */
const log = console.log;
const resolve = (...args) => path_1.default.resolve(__dirname, ...args);
// Make shellsjs throw if there is an error in a command
// It makes it easy to stop the build script when an error occured without having to try/catch or test each invocation
shelljs_1.default.config.fatal = true;
// const getEnvVariable = function (varName: string) {
//     const value = process.env[varName];
//     if (value === undefined) {
//         log(error(`Missing environnement variable ${varName}`))
//         process.exit(1)
//     } else {
//         return value;
//     }
// }
class Examples {
    static get root() {
        return resolve("examples");
    }
    static shellExec(command) {
        shelljs_1.default.exec(command, {
            cwd: Examples.root
        });
    }
    static clean() {
        shelljs_1.default.rm("-rf", resolve("examples", "fableBuild"));
        shelljs_1.default.rm("-rf", resolve("examples", "src", "obj"));
        shelljs_1.default.rm("-rf", resolve("examples", "src", "bin"));
        shelljs_1.default.rm("-rf", resolve("examples", "output"));
    }
    static async watch() {
        Examples.clean();
        Examples.shellExec("npm install");
        await concurrently_1.default([
            {
                command: "npx webpack serve --mode development",
                cwd: Examples.root
            },
            {
                command: "dotnet fable --outDir fableBuild --watch",
                cwd: Examples.root
            }
        ], {
            prefix: "none"
        });
    }
    static async build() {
        Examples.clean();
        Examples.shellExec("npm install");
        Examples.shellExec("dotnet fable --outDir fableBuild");
        Examples.shellExec("npx webpack --mode production");
    }
}
yargs_1.default(helpers_1.hideBin(process.argv))
    .strict()
    .help()
    .alias("help", "h")
    .command("examples", "Commands related to the Example project", (argv) => {
    return argv
        .command("watch", "Start Example in watch mode.", () => { }, Examples.watch)
        .command("build", "Build Example project using production mode", () => { }, Examples.build);
})
    // .command(
    //     "publish",
    //     "Use this command when you want to release a new version of the library and update the demo project on Github pages",
    //     (argv) => {
    //         argv
    //             .options(
    //                 "demo-only",
    //                 {
    //                     description: "When active, the publish task will only publish the demo project on Github pages",
    //                     type: "boolean",
    //                     default: false
    //                 }
    //             )
    //     },
    //     publishHandler
    // )
    .version(false)
    .argv;
