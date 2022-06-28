import { generateTypechainContracts } from "./generate-typechain"
import { extractAbis } from "./extract"
import { createNpmWorkspace } from "./init-workspaces"
import { setupConfig } from "../utils"
import { execSync } from "child_process"
import { rmSync } from "fs"
import chalk from "chalk"
import path from "path"
import { Command } from "./types"
 
const tcPackage = (argv: any) => {
    const packageName = argv['package']
    const packagePath = path.resolve('packages', packageName)
    argv['out'] = path.resolve('temp') // Direcory to temporarily save extracted ABIs.

    console.log(chalk.yellow('1. Creating NPM workspace for package.'))
    createNpmWorkspace(packagePath)

    console.log(chalk.yellow('\n2. Extracting abis from artifacts.'))
    extractAbis(argv)

    console.log(chalk.yellow('\n3. Generating typechained contracts.'))
    generateTypechainContracts([path.resolve(argv['out'],'*.json'), path.resolve('packages', packageName, 'src')])

    console.log(chalk.yellow('\n4. Configuring typescript and installing dependencies.'))
    setupConfig(packageName)

    console.log(chalk.yellow("\n5. Building package"))
    execSync('npm run build:' + packageName)

    
    rmSync(argv['out'],{force: true, recursive: true}) // Remove directory where extracted ABIs were saved.
    console.log(chalk.green("Package built successfully! Module is compatible with esm and cjs.\x07"))
}

const tcPackageCheck = () => {
    // @ts-ignore
    if (argv['filter'] && argv['filter'].length === 0) {
        throw new Error(chalk.red("Filter is empty, please provide at least one filter or remove -f/--filter from your options when running the command"))
    }

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