import chalk from "chalk"
import { exec, execSync } from "child_process"
import path from "path"
import { askUser, loadJson } from ".."

const prompt = require('prompt-sync')()

/**
 * Final user approval before updaqting package.json
 * @param workspacePackageJson 
 */
export const getUserApproval = (workspacePackageJson: any) => {
    console.log(chalk.cyan("\nThis would be your package's package.json: \n"))
    console.log(workspacePackageJson)


    return askUser('Is this okay? (yes) ', true)
}

/**
 * Load pacakge.json and edit if necessary
 * @param workspaceName 
 * @returns package.json as object
 */
export const getPackageInfo = (workspaceName: string) => {
    const edit = prompt(chalk.yellow('Do you want to edit the package.json? (yes) '))

    if (!edit.includes('n') && !edit.includes('N')) {
        console.log(chalk.cyan('\nTo avoid editing a field, press enter'))

        let workspacePackageJson:any = loadJson(path.resolve("packages", workspaceName,'package.json'))

        const scope = workspacePackageJson.name.indexOf('@') < 0 ? "" : "(" + workspacePackageJson.name.slice(0 , workspacePackageJson.name.indexOf('/')) + ") "
        const packageScope = prompt('Package scope: ' + chalk.gray(scope))
        if(packageScope.length !== 0) {
            execSync('npm init --scope=' + packageScope + " -y --workspace=packages/" + workspaceName, {encoding: 'utf-8'})
        }

        const packageName = prompt('Package author: ' + chalk.gray("(" + workspacePackageJson.author + ") "))
        if(packageName.length !== 0) {
            workspacePackageJson['author'] = packageName
        }

        const packageDescription = prompt('Package description: ' + chalk.gray("(" + workspacePackageJson.description + ") "))
        if (packageDescription.length !== 0) {
            workspacePackageJson['description'] = packageDescription
        }

        const packageVersion = prompt('Package version: ' +  chalk.gray( "(" + workspacePackageJson.version + ") "))
        if (packageVersion) {
            workspacePackageJson['version'] = packageVersion
        }
        return workspacePackageJson
    }

    return loadJson(path.resolve("packages", workspaceName,'package.json'))
}

/**
 * Publish pacakge. Gracefully handles errors.
 */
export const publishPackage = (packageName: string, workspacePackageJson: any) => {
    console.log(chalk.yellow('\nPublishing package... this might take a while.\n'))
    exec('npm run publish:' + packageName, {encoding: "utf-8"}, (error, stdout) => {
        
        if(error) {
            console.log(error)
            console.log(chalk.red('\nThere seems to be a problem :('))
            return
        }

        if(stdout) {
            console.log(stdout)
            console.log(chalk.green('Yay! Now you can install your package by running: npm install ' + workspacePackageJson.name + '\x07'))
        }
    })
}