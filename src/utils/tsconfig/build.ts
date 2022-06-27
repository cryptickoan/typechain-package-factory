import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import path from 'path'
import { loadJson } from '..'
import { base, esm, cjs } from './tsconfig'

export function setupConfig(packageName: string) {
    // Typescript files
    writeFileSync('./packages/test/tsconfig-base.json', JSON.stringify(base, null, 2), {encoding: 'utf-8' })
    writeFileSync('./packages/test/tsconfig-esm.json', JSON.stringify(esm, null, 2), {encoding: 'utf-8' })
    writeFileSync('./packages/test/tsconfig-cjs.json', JSON.stringify(cjs, null, 2), {encoding: 'utf-8' })

    const projectPackageJson = loadJson(path.resolve('package.json'))
    const projectBuildCommand = "npm run build --workspace=packages/" + packageName
    projectPackageJson.scripts['build:' + packageName] = projectBuildCommand
    writeFileSync(path.resolve('package.json'), JSON.stringify(projectPackageJson, null, 2))
    
    const workspacePackageJson = loadJson(path.resolve("packages", packageName,'package.json'))
    const packageCommand = "npx tsc -p tsconfig-esm.json && npx tsc -p tsconfig-cjs.json"
    workspacePackageJson.scripts["build"] = packageCommand

    if (!workspacePackageJson.dependencies) { workspacePackageJson.dependencies = {} }

    writeFileSync(path.resolve("packages", packageName,'package.json'), JSON.stringify(workspacePackageJson, null, 2))
    if (Object.keys(workspacePackageJson.dependencies).length === 0) {
        console.log("Installing ethers and typescript in package workspace")
        const an = execSync("npm i ethers typescript -w packages/" + packageName, {encoding: "utf-8"})
        console.log(an)
    }
}