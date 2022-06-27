import chalk from "chalk"
import { execSync } from "child_process"
import { existsSync, mkdirSync, rmSync } from "fs"
import path from "path"
import { setupConfig } from "../utils"
import { Command, extractAbis } from "./extract"
import { generateTypechainContracts } from "./generate-typechain"
import { createNpmWorkspace } from "./init-workspaces"

const tcPackage = (argv: any) => {
    const packageName = argv['package']
    const packagePath = path.resolve('packages', packageName)
    argv['out'] = path.resolve('temp')

    console.log(chalk.yellow('1. Creating NPM workspace for package.'))
    createNpmWorkspace(packagePath)

    console.log(chalk.yellow('\n2. Extracting abis from artifacts.'))
    extractAbis(argv)

    // Create src folder inside package.
    if (!existsSync(path.resolve('packages', packageName, 'src'))){
        mkdirSync(path.resolve('packages', packageName, 'src'))
    }

    console.log(chalk.yellow('\n3. Generating typechained contracts.'))
    const pair = [path.resolve(argv['out'],'*.json'), path.resolve('packages', packageName, 'src')]
    generateTypechainContracts(pair)

    console.log(chalk.yellow('\n4. Configuring typescript.'))
    setupConfig(packageName)
    console.log(chalk.green('\rConfiguration successful, you can now build the typechain package by running npm build:' + packageName))

    console.log(chalk.yellow("\n5. Building package"))
    execSync('npm run build:' + packageName)
    console.log(chalk.green("Package built successfully! Module is compatible with esm and cjs.\x07"))

    rmSync(argv['out'],{force: true, recursive: true})
}

const tcPackageCheck = () => {
    return true
}

export const tcPackageCommand: Command = {
    "name": "typechain-package",
    "description": "Package typechain contracts",
    "options": {
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
        }
    },
    function: async function (argv: any) { tcPackage(argv) },
    check: tcPackageCheck
}