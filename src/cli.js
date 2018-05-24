#!/usr/bin/env node

'use strict'

const fs = require('fs')
const read = file => String(fs.readFileSync(file))
const BFM = require('./bfm')
const BF = require('./bf')

function compileBFM (argv) {
  let out = BFM(read(argv.input), argv.debug)
  if (argv.output) fs.writeFileSync(argv.output, out)
  else console.log(out)
}

function runBF (argv) {
  BF(read(argv.input))
}

require('yargs')
  .command('bfm <input> [output]', 'Compile BFM to BF', yargs => yargs
    .option('input', {describe: 'BFM Input File', type: 'string'})
    .option('output', {describe: 'BF Output File', type: 'string'})
    .option('debug', {describe: 'Enable Debug in Output', type: 'boolean', default: false}), compileBFM)
  .command('bf <input>', 'Execute BF', yargs => yargs
    .option('input', {describe: 'BFM Input File', type: 'string'}), runBF)
  .demandCommand(1)
  .argv
