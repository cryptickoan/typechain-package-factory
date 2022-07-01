import { extractAndSave, extractArtifactsInDirectory, getArtifactPaths } from "../utils/extract";
import { Command } from "./types";
import chalk from "chalk";
import { checkNodeJsVersion } from "../utils";

/**
 * This function will extract all abis from the given artifact directory into their own files.
 * @param commands - List of commandline commands and options, from yargs.
 */
export const extractAbis = async (commands: any) => {
    checkNodeJsVersion()
    // 1. Get argument from command line.
    const filter = commands['filter']
    const directory = commands['source']
    const output = commands['out']

    // 2. From the given directory,  extract all forge generated artifacts.
    const filesInDirectory = await extractArtifactsInDirectory(directory, filter)

    // 3. From the forge generated artifacts, extract all json file paths.
    const artifactPaths = getArtifactPaths(directory, filesInDirectory)

    // 4. Extract abi from the json objects and then save it inside the given output directory path.
    extractAndSave(
        artifactPaths.abiPaths, 
        output, 
        artifactPaths.abiFilenames
    )

    console.log(chalk.green("\rABI extraction successful!"))
}

const extractCheck = (argv: any) => {
    // @ts-ignore
    if (argv['filter'] && argv['filter'].length === 0) {
          throw new Error(chalk.red("Filter is empty, please provide at least one filter or remove -f/--filter from your options when running the command"))
    }

    // @ts-ignore
    if (typeof argv['source'] !== "undefined" && argv['source'].length === 0) {
          throw new Error(chalk.red("Source is empty, please provide at least one path"))
    }
    return true
}

export const extractCommand: Command = {
    name: "extract",
    description: 'Extract abis from artifacts.',
    options: {
        source: {
              "alias": "s",
              "describe": "Path to directory containing contract artifacts",
              "type": "string",
              "demandOption": true,
        },
        filter: {
              "alias": "f",
              "describe": "Files contianing this string will be ignored",
              "type": "array",
        },
        out: {
              "alias": "o",
              "describe": "Path for output",
              "type": "string",
              "demandOption": true
        },
        help: {
              alias: 'h'
        }
    },
    function: extractAbis,
    check: extractCheck
}
