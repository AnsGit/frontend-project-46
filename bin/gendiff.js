#!/usr/bin/env node

import { Command } from 'commander';
import getDiff from '../src/index.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option(
    '-f, --format [type]',
    'output format (stylish/plain/json)',
    'stylish',
  )
  .arguments('<filepath1> <filepath2>')
  .action((file1path, file2path, { format }) => {
    const diff = getDiff(file1path, file2path, format);
    console.log(diff);
  });

program.parse();
