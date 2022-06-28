import chalk from "chalk"
import { execSync } from "child_process"
import { createDirectory } from "../utils"
import { Command } from "./types"

export const generateTypechainContracts = (pair: string[]) => {
    createDirectory(pair[0], pair[1])
    
    // 1. Call typechain to generate typed contracts
    const output = execSync('npx typechain --target ethers-v5 --out-dir ' +  pair[1] + " " + pair[0],{ encoding: 'utf-8' })
    console.log(chalk.green("\r" + output.slice(0, output.indexOf('!'))))
}

export const generateTypechain = (argv: any) => {
    // Get all pairs
    const givenArguments = argv['pairs']
    
    // For every pair generate typechain contracts
    let i = 0
    while (i < givenArguments.length) {
        const array = [givenArguments[i], givenArguments[i + 1]]
        generateTypechainContracts(array)
        i = i + 2
    }
}

const generateTypechainCheck = (argv: any) => {
        // @ts-ignore
       if (argv['pairs'] && argv['pairs'].length < 2) {
             throw new Error(chalk.red("Pairs is empty, please provide at least one pair after --pairs."))
       }

       return true
}

export const generateTypechainCommand: Command = {
    name: "generate-typechain",
    description: "Generate typechain for the given contract and save output to the fiven path",
    options: {
        pairs: {
              "alias": "-p",
              "describe": "Contract source path and typechain contract output path",
              "type": "array",
              "demandOption": true
        }
    },
    function: async function (argv: any) { generateTypechain(argv) },
    check: generateTypechainCheck
}