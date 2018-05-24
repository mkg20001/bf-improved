#!/bin/bash

CLI=(node ./src/cli.js)

set -ex

"${CLI[@]}" bfm example.bfm example.bf --debug
"${CLI[@]}" bf example.bf
"${CLI[@]}" bftoc example.bf example.c
gcc example.c -o example.out
./example.out
