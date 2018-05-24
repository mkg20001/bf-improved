#!/bin/bash

CLI=(node ./src/cli.js)

set -ex

"${CLI[@]}" bfm example.js example.bf --debug
"${CLI[@]}" bf example.bf
