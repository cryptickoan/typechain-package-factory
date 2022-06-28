import chalk from "chalk";
import * as childProcess from "child_process"
import { Command } from "./types";

/**
 * Initiates an npm workspaces.
 * @param workspace - Name of the workspace.
 */
export const createNpmWorkspace = (workspace: string) => {
    const output = childProcess.execSync('npm init -w ' + workspace + " -y", { encoding: 'utf-8' })
    console.log(chalk.green("\r" + output.slice(0, output.indexOf(":"))))
}

/**
 * Will create several npm workspaces
 * @param argv - Array. [workspaceName1, workspaceName2.....]
 */
const initWorkspaces = (argv: any) => {
    // 1. Extract all command line argument inputs
    const workspaces = argv['paths']
    
    // 2. For every given workspace path, create an npm workspace.
    for (const workspace of workspaces) {
        createNpmWorkspace(workspace)
    }
}

const initWorkspacesCheck = (argv: any) => {
    // @ts-ignore
    if (argv['paths'] && argv['paths'].length === 0) {
          throw new Error(chalk.red("Paths is empty, please provide at least one path after --paths."))
    }

    return true
}

export const initWorkspacesCommand: Command = {
    name: 'init-workspaces',
    description: 'Initiate one or more npm workspaces.',
    options:  {
        paths: {
              "alias": "p",
              "describe": "One or several paths where workspace will be initiated.",
              "type": "array",
              "demandOption": true
        },
        help: {
              alias: "h"
        }
    },
    function: async function (argv: any) {initWorkspaces(argv)},
    check: initWorkspacesCheck
}