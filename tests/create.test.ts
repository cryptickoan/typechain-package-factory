import { DAI_ADDRESS, executionArguments, expectedTypechainOutput, expectTypescriptOutput, folderStructure } from "./utils"
import { atomicWrite, checkNodeJsVersion, loadJson, readAndFilterDirectory, saveJson } from "../src/utils"
import { JsonRpcProvider } from '@ethersproject/providers'
import { create } from "../src/commands/create"
import { readFileSync, rmSync } from "fs"
import path from "path"
import 'dotenv/config'

// We only test the create command because its literally the command using all functions in this project. 
// All other commands use a subset of them.
describe('The create command', () => {
    jest.setTimeout(50000)
    const originalPackageJson = loadJson(path.resolve('package.json'))
    const originalPackageLock = loadJson(path.resolve('package-lock.json'))
    const originalGitIgnore = readFileSync(path.resolve('.gitignore'), {encoding: 'utf-8'})

    beforeAll(async () => {
        await checkNodeJsVersion()
        await create(executionArguments)
    })

    afterAll(() => {
        saveJson(path.resolve('package.json'), originalPackageJson)
        saveJson(path.resolve('package-lock.json'), originalPackageLock)
        atomicWrite(path.resolve('.gitignore'), originalGitIgnore)
        rmSync(path.resolve('packages'),{force: true, recursive: true}) // Remove the workspace directory
    })

    describe('hrllo', () => {

        it("Project's package.json should contain workspaces key", () => {
            const packageJson = loadJson(path.resolve('package.json'))
            expect(Object.keys(packageJson)).toContain('workspaces')
        })

        it("Should create the workspace directory, and this directory should have the expected structure", () => {
            const folder = readAndFilterDirectory(path.resolve('packages', executionArguments['package']))
            expect(folder).toEqual(folderStructure)
        })

        it("Should generate all the expected typechain files", () => {
            const typechainContracts = readAndFilterDirectory(path.resolve('packages', executionArguments['package'], 'src'))
            expect(typechainContracts).toEqual(expectedTypechainOutput)
        })

        it("Typescript build files should have expected structure", () => {
            const buildFiles = readAndFilterDirectory(path.resolve('packages', executionArguments['package'], 'dist'))
            expect(buildFiles).toEqual(expectTypescriptOutput)
        })

        it("User should be able to require the module and call the contract", async () => {
            const typechainedContractsCJS = require('test')
            const daiContract = typechainedContractsCJS.ERC20__factory.connect(DAI_ADDRESS, new JsonRpcProvider(process.env.RPC_URL))
            const decimals = await daiContract.decimals()
            expect(decimals).toBe(18)

        })

        it('User should be able to import the module and call the contract', async () => {
            // Ignoring imports because the module is created and available only at test runtime.
            // @ts-ignore
            const typechainedContractsESM = await import('test')
            const daiContract = typechainedContractsESM.ERC20__factory.connect(DAI_ADDRESS, new JsonRpcProvider(process.env.RPC_URL))
            const name = await daiContract .name()
            expect(name).toBe('Dai Stablecoin')
        })
    })
})