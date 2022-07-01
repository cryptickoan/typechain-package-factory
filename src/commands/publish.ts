import chalk from "chalk";
import { writeFileSync } from "fs";
import path from "path";
import { checkNodeJsVersion, verifyPackageExists } from "../utils";
import { getPackageInfo, getUserApproval, publishPackage } from "../utils/publish";
import { Command } from "./types";

/**
 * Publsh a single package, also handles package.json edit.
 */
const publish = async (argv: any) => {
    const packageName = argv['package']
    
    checkNodeJsVersion()
    verifyPackageExists(packageName)
    const workspacePackageJson = getPackageInfo(packageName)

    if(!getUserApproval(workspacePackageJson)) return

    writeFileSync(path.resolve("packages", packageName,'package.json'), JSON.stringify(workspacePackageJson, null, 2))
    console.log(chalk.green('Package.json updated successfuly!'))

    publishPackage(packageName, workspacePackageJson)
}

export const publishCommand: Command = {
    name: "publish",
    description: "Publish package and handle metadata edition",
    options: {
        name: {
            alias: "n",
            describe: "Name of the workspace containing package.",
            demandOption: true,
            type: "string",
            nargs: 1
        }
    },
    function: publish,
    check: () => {return true}
}