import { Options } from "yargs"

export type Command = {
    ["options"]: {
        [key:string]: Options,
    },
    function: any,
    "description": string,
    "name": string,
    check: any
}