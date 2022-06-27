import { loadJson, readAndFilterDirectory, saveJson } from "../utils";
import { existsSync, mkdirSync } from "fs";
import { Argv, Options } from "yargs";
import chalk from "chalk";
import path from "path";

/**\
 * This funciton will get all json file paths inside the given directory and also the name of the files.
 */
const getArtifactPaths = (
    artifactDirPath: string, // Dir path where all artifacts are
    artifactsToGet: string[] // A list of artifact names inside this directory path
) => {
    let abiPaths: string[] = []
    let abiFilenames: string[] = []
    
    // Artifact names end in .sol and abis in .json.
    for (const i of artifactsToGet) {
        // For evety artifact in the directory, extract the name of the file + delete .sol and make it .json
        abiFilenames.push(i.slice(0,i.indexOf('.')) + ".json")

        // Generate path for the abi file. Should be a json file. 
        abiPaths.push(path.resolve(artifactDirPath, i, abiFilenames[artifactsToGet.indexOf(i)]))
    }

    // Return the abi paths, and the abi filenames
    return { abiPaths, abiFilenames }
}

/**
 * This function will load the json artifact file and extract the abi into its own file.
 * @param artifactPaths - A list of artifact paths. i.e forge-build-output/Something.sol/Something.json
 * @param outputPath - Directory to save abi file to. 
 * @param abiFilenames - An array with the names of the to be created abis. i.e  extract-output/Something.json
 */
const extractAndSave = (
    artifactPaths: string[], 
    outputPath: string, 
    abiFilenames: string[]
) => {

    // If output directory does not exist, create it.
    if (!existsSync(outputPath)){
        mkdirSync(outputPath)
    }

    // Extract all abis
    for (const abiPath of artifactPaths) {
        // 1. Load the arfitact json object and get the abi.
        const abi = loadJson(abiPath).abi
        
        // 2. Generate path name for the abi json file.
        const filename = path.resolve(outputPath, abiFilenames[artifactPaths.indexOf(abiPath)])

        // 3. Create and save the abi json file.
        saveJson(filename, abi)
    }
}

export const extractArtifactsInDirectory = (directory: string, filter: string[]) => {
    let filesInDirectory
    try {
        // 1. Get all files in directory
        filesInDirectory = readAndFilterDirectory(directory, filter)

        // 2. Check for all forge generated artifacts 
        let abis: string[] = []
        for (const file of filesInDirectory) {
            if (file.includes('sol')) {abis.push(file)}
        }

        // // 3. If there are no artifacts throw an error.
        if (abis.length === 0) {
            throw new Error('hey')
        }
     } catch (e) {
        throw new Error(chalk.red("No artifacts found in " + directory + " Maybe you didn't build the contracts yet?"))
    }

    return filesInDirectory
}

/**
 * This function will extract all abis from the given artifact directory.
 * @param commands - List of commandline commands and options, from yargs.
 */
export const extractAbis = (commands: any) => {
    // 1. Get argument from command line.
    const filter = commands['filter']
    const directory = commands['source']
    const output = commands['out']

    // 2. From the given directory, extract all forge generated artifacts.
    const filesInDirectory = extractArtifactsInDirectory(directory, filter)

    // 3. From the forge generated artifacts, get all json files.
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
    description: 'Extract abis from artifacts',
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
    function: async function (argv: Argv) {
        extractAbis(argv)
    },
    check: extractCheck
}

export type Command = {
    ["options"]: {
        [key:string]: Options,
    },
    function: any,
    "description": string,
    "name": string,
    check: any
}
