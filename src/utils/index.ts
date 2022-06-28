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
    atomicWrite(filename, JSON.stringify(data) + "\n");
}

export const createDirectory = (packageName: string, directoryName: string) => {
    if (!fs.existsSync(path.resolve('packages', packageName, directoryName))){
        fs.mkdirSync(path.resolve('packages', packageName, directoryName))
    }
}