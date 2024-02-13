#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('gendiff [options]')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0');

program.parse();
