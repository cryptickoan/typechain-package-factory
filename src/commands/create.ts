import { Command } from "./types"
import chalk from "chalk"
import { update } from "./update"
import { createNpmWorkspace } from "../utils/create"
 
/**
 * Create and modularize typechain contracts. 
 */
const create = async (argv: any) => {
    const packageName = argv['package']

    console.log(chalk.yellow('1. Creating NPM workspace for package.'))
    await createNpmWorkspace(packageName)

   update(argv)
}

const createCheck = (argv: any) => {
    // @ts-ignore
    if (argv['filter'] && argv['filter'].length === 0) {
        throw new Error(chalk.red("Filter is empty, please provide at least one filter or remove -f/--filter from your options when running the command"))
    }

    return true
}

export const createCommand: Command = {
    "name": "create",
    "description": "Create a package for your contracts.",
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
    function: async function (argv: any) { create(argv) },
    check: createCheck
}