export const executionArguments = {
    "name": "test",
    "source": "./tests/utils/artifacts",
    "filter": ["Contract"],
    "publish": false
}
export const folderStructure = [
    '.npmignore',
    'dist',
    'package.json',
    'src',
    'tsconfig-base.json',
    'tsconfig-cjs.json',
    'tsconfig-esm.json'
  ]

export const expectTypescriptOutput = [ 'cjs', 'esm', 'types' ]

export const expectedTypechainOutput = [ 'ERC20.ts', 'common.ts', 'factories', 'index.ts' ]

export const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"