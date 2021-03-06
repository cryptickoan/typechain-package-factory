export const tsBase = {
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationDir": "dist/types",
    "esModuleInterop": true,
    "inlineSourceMap": false,
    "lib": ["esnext"],
    "listEmittedFiles": false,
    "listFiles": false,
    "moduleResolution": "node",
    "noFallthroughCasesInSwitch": true,
    "pretty": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "traceResolution": false
  },
  "compileOnSave": false,
  "exclude": ["node_modules"],
  "include": ["src"]
}

export const tsCjs = {
  "extends": "./tsconfig-base.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist/cjs",
    "target": "es2015"
  }
}

export const tsEsm = {
  "extends": "./tsconfig-base.json",
  "compilerOptions": {
    "module": "esnext",
    "outDir": "dist/esm",
    "target": "esnext"
  }
}

export const npmignoreContents = "src\ntsconfig*.json"

export const gitignoreContents = "\n\n#####################\n# Typechain Package #\n#####################\n\npackages/**/dist"

export const esmCjsCompatibility = {
  "import": "./dist/esm/index.js",
  "require": "./dist/cjs/index.js"
}