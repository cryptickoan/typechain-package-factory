import chalk from "chalk";
import { execSync } from "child_process";
import { rmSync } from "fs";
import path from "path";
import { askUser, loadJson, setupConfig } from "../utils";
import { generateTypechainContracts } from "../utils/create";
import { getUserApproval, publishPackage } from "../utils/publish";
import { extractAbis } from "./extract";
import { Command } from "./types";

export const update = async (argv: any) => {
    const packageName = argv['name']
    argv['out'] = path.resolve('packages', packageName, 'extracted-abis-temp') // Direcory to temporarily save extracted ABIs.
    const publish = argv['publish']

    console.log(chalk.yellow('\nExtracting abis from artifacts.'))
    await extractAbis(argv)

    console.log(chalk.yellow('\nGenerating typechained contracts.'))
    await generateTypechainContracts([path.resolve(argv['out'],'*.json'), path.resolve('packages', packageName, 'src')], packageName)
    rmSync(argv['out'],{force: true, recursive: true}) // Remove directory where extracted ABIs were saved.

    console.log(chalk.yellow('\nConfiguring typescript and installing dependencies.'))
    await setupConfig(packageName)

    console.log(chalk.yellow("\nBuilding package"))
    execSync('npm run build:' + packageName, {encoding: 'utf-8'})
    console.log(chalk.green("Package built successfully! Module is compatible with esm and cjs.\x07"))

    if (publish === false) return 

    if(publish === true) {
        const packageJson = loadJson(path.resolve("packages", packageName,'package.json')) 
        publishPackage(packageName, packageJson)
    }

    if (typeof publish === "undefined") {
        if (askUser('Do you want to publish this pacakge? (yes) ', false)) {
            const packageJson = loadJson(path.resolve("packages", packageName,'package.json')) 
            if(!getUserApproval(packageJson)) return
            publishPackage(packageName, packageJson)
        }
    }
}

export const updateCommand: Command = {
    name: "update",
    description: "Update package",
    options: {
        package: {
            "alias": "p",
            "describe": "Name for the package.",
            "nargs": 1,
            "type": "string",
            "demandOption": true
        },
        source: {
            "alias": "s",
            "describe": "Path where artifacts are found.",
            "nargs": 1,
            "type": "string",
            "demandOption": true
        },
        filter: {
            "alias": "f",
            "describe": "Files contianing this string will be ignored.",
            "type": "array"
        },
        publish: {
            "alias": "p",
            "describe": "If true package will be published, if false package will not be published",
            "type": "boolean"
        }
    },
    function: update,
    check: () => true
}