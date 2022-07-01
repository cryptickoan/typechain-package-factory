#! /usr/bin/env node
//@ts-ignore
import yargonaut from 'yargonaut'
import yargs from "yargs";
import chalk from "chalk";
import { extractCommand } from './commands/extract';
import { createCommand } from './commands/create';
import { publishCommand } from './commands/publish';
import { updateCommand } from './commands/update';

yargonaut.style('green').helpStyle('green').errorsStyle('red')
const usage =  chalk.green("\nUsage: tc-package <SUBCOMMAND> <OPTIONS>");
yargs  
      .version(false)
      .usage(usage)
      .command(createCommand.name, createCommand.description, createCommand.options, createCommand.function)
      .check((argv) => createCommand.check(argv))
      .command(updateCommand.name, updateCommand.description, updateCommand.options, updateCommand.function)
      .check((argv) => updateCommand.check(argv))
      .command(publishCommand.name, publishCommand.description, publishCommand.options, publishCommand.function)
      .check((argv)=> publishCommand.check(argv))
      .command(extractCommand.name, extractCommand.description, extractCommand.options, extractCommand.function)
      .check((argv) => extractCommand.check(argv))
      .help(true)  
      .argv;