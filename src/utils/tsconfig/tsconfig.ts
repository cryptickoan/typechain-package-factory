export const base = {
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

export const cjs = {
  "extends": "./tsconfig-base.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist/cjs",
    "target": "es2015"
  }
}

export const esm = {
  "extends": "./tsconfig-base.json",
  "compilerOptions": {
    "module": "esnext",
    "outDir": "dist/esm",
    "target": "esnext"
  }
}

