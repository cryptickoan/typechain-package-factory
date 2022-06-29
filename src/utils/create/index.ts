import chalk from "chalk"
import { execSync } from "child_process"
import { createDirectory } from ".."

/**
 * Generate typechain contracts from the given source and save to the given output path.
 * @param pair - Array. [sourcePath, outputPath]
 */
 export const generateTypechainContracts = async (pair: string[]) => {
    createDirectory(pair[0], pair[1])
    
    // 1. Call typechain to generate typed contracts
    const output = execSync('npx typechain --target ethers-v5 --out-dir ' +  pair[1] + " " + pair[0],{ encoding: 'utf-8' })
    console.log(chalk.green("\r" + output.slice(0, output.indexOf('!'))))
}


/**
 * Initiates an npm workspaces.
 * @param workspace - Name of the workspace.
 */
export const createNpmWorkspace = async (workspace: string) => {
    const output = execSync('npm init -w ' + 'packages/' + workspace + " -y", { encoding: 'utf-8' })
    console.log(chalk.green("\r" + output.slice(0, output.indexOf(":"))))
}