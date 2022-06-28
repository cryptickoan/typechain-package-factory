#! /usr/bin/env node
//@ts-ignore
import yargonaut from 'yargonaut'
import yargs from "yargs";
import chalk from "chalk";
import { extractCommand } from './commands/extract';
import { initWorkspacesCommand } from './commands/init-workspaces';
import { generateTypechainCommand } from './commands/generate-typechain';
import { createCommand } from './commands/create';

yargonaut.style('green').helpStyle('green').errorsStyle('red')
const usage =  chalk.green("\nUsage: tc-package <SUBCOMMAND> sentence to be translated");
yargs  
      .version(false)
      .usage(usage)
      .command(createCommand.name, createCommand.description, createCommand.options, createCommand.function)
      .check((argv) => createCommand.check(argv))
      .command(extractCommand.name, extractCommand.description, extractCommand.options, extractCommand.function)
      .check((argv) => extractCommand.check(argv))
      .command(initWorkspacesCommand.name, initWorkspacesCommand.description, initWorkspacesCommand.options, initWorkspacesCommand.function) 
      .check((argv) => initWorkspacesCommand.check(argv))
      .command(generateTypechainCommand.name, generateTypechainCommand.description, generateTypechainCommand.options, generateTypechainCommand.function)
      .check((argv) => generateTypechainCommand.check(argv))
      .help(true)  
      .argv;