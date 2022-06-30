import chalk from 'chalk';
import * as fs from 'fs'
import path from 'path';
export { setupConfig } from './tsconfig/build';

export const readAndFilterDirectory = (
    path: string,
    filter?: string[]
) => {
    // 1. Load all files in the directory.
    let filesInDirectory: string[]
    try {
        filesInDirectory = fs.readdirSync(path)
    } catch (e) {
        throw Error('Error reading directory! ' + path)
    }
    
    // 2. If theres a filter, filter the filesInDirectory array.
    if (filter) {
        for (const i of filter) {
            filesInDirectory  = filesInDirectory.filter(file => !file.includes(i))
        }
    }

    return filesInDirectory
}

export function loadJson(path: string): any {
    return JSON.parse(fs.readFileSync(path).toString());
}

export function atomicWrite(targetPath: string, value: string | Uint8Array): void {
    const tmp = path.resolve(".atomic-tmp");
    fs.writeFileSync(tmp, value);
    fs.renameSync(tmp, targetPath);
}

export function saveJson(filename: string, data: any, sort?: boolean): any {
    atomicWrite(filename, JSON.stringify(data, null, 2) + "\n");
}

export const createDirectory = (directoryName: string, packageName: string) => {
    try {
        if (!fs.existsSync(directoryName)){
            fs.mkdirSync(path.resolve('packages', directoryName))
        }
    } catch(e) {
        throw chalk.red("Couldn not create directory under the given package: " + packageName + "\n\nThis usually happens when the package does not exist. Make sure this path exists: \n" +  directoryName + "\n")
    }
}


export const askUser = (text: string, shouldAbort: boolean) => {
    const prompt = require('prompt-sync')()
    console.log("\n")
    const h = prompt(chalk.yellow(text))
    
    if (h.includes('n') || h.includes('N')) {
        if (shouldAbort) {console.log(chalk.grey("Aborted"))}
        return false
    }
    return true
}


export const checkNodeJsVersion = async () => {
    if (parseInt(process.version.slice(1,3)) < 16) {
        throw Error("You're currently using node version: " + process.version + ". Please use 16 or later." )
    }

}
