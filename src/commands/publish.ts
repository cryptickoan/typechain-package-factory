import chalk from "chalk";
import { exec } from "child_process";
import { writeFileSync } from "fs";
import path from "path";
import { loadJson } from "../utils";
import { Command } from "./types";

const prompt = require('prompt-sync')()

const getUserApproval = (workspacePackageJson: any) => {
    console.log("This would be your package's package.json: ")
    console.log({workspacePackageJson})

    const response: string = prompt('Is this okay? (yes) ')

    if (response.includes('n') || response.includes('N')) {
        console.log(chalk.grey("Aborted"))
        return false
    }

    return true
}

const publishPackage = (packageName: string, workspacePackageJson: any) => {
    console.log(chalk.yellow('Publishing package... this might take a while.'))
        
        exec('npm run publish:' + packageName, {encoding: "utf-8"}, (error, stdout) => {
            
            if(error) {
                console.log(error)
                console.log(chalk.red('There seems to be a problem :('))
                return
            }

            if(stdout) {
                console.log(stdout)
                console.log(chalk.green('Yay! Now you can install your package by running: npm install ' + workspacePackageJson.name + '\x07'))
            }
        })

}
const publish = async (argv: any) => {
    const packageName = argv['workspace']
    const workspacePackageJson = loadJson(path.resolve("packages", packageName,'package.json'))

    if (argv['name']) {
        workspacePackageJson['name'] = argv['name']
    }

    if (argv['description']) {
        workspacePackageJson['description'] = argv['description']
    }

    if (argv['version']) {
        workspacePackageJson['version'] = argv['version']
    }

    if(!getUserApproval(workspacePackageJson)) return

    writeFileSync(path.resolve("packages", packageName,'package.json'), JSON.stringify(workspacePackageJson, null, 2))
    console.log(chalk.green('Package.json updated successfuly!'))

    if (argv['publish']) {
        publishPackage(packageName, workspacePackageJson)        
    }
}

export const publishCommand: Command = {
    name: "publish",
    description: "Publish package and handle metadata edition",
    options: {
        name: {
            alias:"n",
            describe: "Name to use for public npm package",
            type: "string",
            nargs: 1
        },
        workspace: {
            alias: "w",
            describe: "Name of the workspace containing package.",
            demandOption: true,
            type: "string",
            nargs: 1
        },
        publish: {
            alias: "p",
            describe: "If true, package will be published",
            type: "boolean"
        },
        description: {
            alias: "d",
            describe: "Package description",
            type: "string"
        },
        version: {
            alias: "v",
            describe: "Version to publish i.e 1.0.0.",
            type: "string",
            nargs: 1
        }
    },
    function: async (argv: any) => publish(argv),
    check: () => {return true}
}