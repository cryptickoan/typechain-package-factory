import { loadJson, readAndFilterDirectory, saveJson } from "../";
import { existsSync, mkdirSync } from "fs";
import chalk from "chalk";
import path from "path";

/**
 * This funciton will get all abi paths inside the given directory and also the name of the files without file extension.
 * @param artifactDirPath - Directory path for contract artifacts.
 * @param artifactsToGet - A list of artifact names inside this directory path
 */
export const getArtifactPaths = (
    artifactDirPath: string,
    artifactsToGet: string[]
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
export const extractAndSave = (
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