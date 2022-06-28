import { base, esm, cjs, npmignoreContents, gitignoreContents, esmCjsCompatibility } from './configFilesSrc'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { loadJson } from '..'
import path from 'path'
import chalk from 'chalk'

export async function setupConfig(packageName: string) {
    await generateTypescriptFiles(packageName)
    await installDependencies(packageName)
    await addBuildScripts(packageName)
    await generateIgnoreFiles(packageName)
    console.log(chalk.green('\rConfiguration successful, you can now build the typechain package by running npm build:' + packageName))
}

const generateTypescriptFiles = async (packageName: string) => {
    writeFileSync('./packages/' + packageName + '/tsconfig-base.json', JSON.stringify(base, null, 2), {encoding: 'utf-8' })
    writeFileSync('./packages/' + packageName +  '/tsconfig-esm.json', JSON.stringify(esm, null, 2), {encoding: 'utf-8' })
    writeFileSync('./packages/' + packageName + '/tsconfig-cjs.json', JSON.stringify(cjs, null, 2), {encoding: 'utf-8' })
}

const addBuildScripts = async (packageName: string) => {
    // Add build scripts to workspace
    const projectPackageJson = loadJson(path.resolve('package.json'))
    const projectBuildCommand = "npm run build --workspace=packages/" + packageName
    projectPackageJson.scripts['build:' + packageName] = projectBuildCommand
    writeFileSync(path.resolve('package.json'), JSON.stringify(projectPackageJson, null, 2))
    
    // Add build scripts to project
    const workspacePackageJson = loadJson(path.resolve("packages", packageName,'package.json'))
    const packageCommand = "npx tsc -p tsconfig-esm.json && npx tsc -p tsconfig-cjs.json"

    workspacePackageJson.scripts["build"] = packageCommand
    workspacePackageJson['exports'] = esmCjsCompatibility

    writeFileSync(path.resolve("packages", packageName,'package.json'), JSON.stringify(workspacePackageJson, null, 2))

}

const installDependencies = async (packageName: string) => {
    const workspacePackageJson = loadJson(path.resolve("packages", packageName,'package.json'))

    // Install dependencies if not previously installed.
    if (!workspacePackageJson.dependencies) { workspacePackageJson.dependencies = {} }
    if (Object.keys(workspacePackageJson.dependencies).length === 0) {
        console.log("Installing ethers and typescript in packages/" + packageName)
        const an = execSync("npm i ethers typescript -w packages/" + packageName, {encoding: "utf-8"})
        console.log(an)
    }
}

const generateIgnoreFiles = async (packageName: string) => {
    // Generate npm ignore file
    writeFileSync(path.resolve('packages/', packageName, '.npmignore'), npmignoreContents)

    // Edit the project's .gitignore.
    let gitignoreData = readFileSync(path.resolve('.gitignore'), {encoding: "utf-8"})
    gitignoreData = gitignoreData.includes(gitignoreContents) ? gitignoreData : gitignoreData + gitignoreContents
    writeFileSync(path.resolve('.gitignore'), gitignoreData)
}