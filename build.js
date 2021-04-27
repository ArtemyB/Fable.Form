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
const gh_pages_1 = __importDefault(require("gh-pages"));
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
class GHPages {
    static publishPromise(path, config) {
        if (config === undefined) {
            return new Promise((resolve, reject) => {
                gh_pages_1.default.publish(path, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                gh_pages_1.default.publish(path, config, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
}
class Examples {
    static get root() {
        return resolve("examples");
    }
    static resolve(...args) {
        return resolve(Examples.root, ...args);
    }
    static shellExec(command) {
        shelljs_1.default.exec(command, {
            cwd: Examples.root
        });
    }
    static clean() {
        shelljs_1.default.rm("-rf", Examples.resolve("fableBuild"));
        shelljs_1.default.rm("-rf", Examples.resolve("src", "obj"));
        shelljs_1.default.rm("-rf", Examples.resolve("src", "bin"));
        shelljs_1.default.rm("-rf", Examples.resolve("output"));
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
    static build() {
        Examples.clean();
        Examples.shellExec("npm install");
        Examples.shellExec("dotnet fable --outDir fableBuild");
        Examples.shellExec("npx webpack --mode production");
    }
    static async publish() {
        Examples.build();
        await GHPages.publishPromise(Examples.resolve("output"));
    }
}
class Tests {
    static get root() {
        return resolve("tests");
    }
    static resolve(...args) {
        return resolve(Tests.root, ...args);
    }
    static shellExec(command) {
        shelljs_1.default.exec(command, {
            cwd: Examples.root
        });
    }
    static clean() {
        shelljs_1.default.rm("-rf", Tests.resolve("bin"));
        shelljs_1.default.rm("-rf", Tests.resolve("obj"));
        shelljs_1.default.rm("-rf", Tests.resolve("fableBuild"));
    }
    static async watch() {
        Tests.clean();
        // We need to create the fableBuild directory in order to get nodemon / mocha to watch in it
        shelljs_1.default.mkdir(Tests.resolve("fableBuild"));
        await concurrently_1.default([
            {
                command: 'npx nodemon --watch fableBuild --delay 150ms --exec "npx mocha -r esm -r mocha.env.js --reporter dot --recursive fableBuild"',
                cwd: Tests.root
            },
            {
                command: "dotnet fable --watch --outDir fableBuild",
                cwd: Tests.root
            }
        ], {
            prefix: "none"
        });
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
    .command("tests", "Commands related to the tests", (argv) => {
    return argv
        .command("watch", "Start the Test in watch mode re-compiling and re-running them on file change", () => { }, Tests.watch);
})
    .command("publish", "Command used to released a new version, update Github pages, etc.", (argv) => {
    return argv
        .command("ghpages", "Publish the example project on Github pages", () => { }, Examples.publish);
})
    .version(false)
    .argv;
