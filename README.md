# bf-improved

Brainfuck Improved

## How

BFM is a JS based language that makes brainfuck development easier

Additionally this CLI features a brainfuck runtime and a brainfuck2c compiler

## Examples

```js

strprint('Hello World!\n', 0) // write string to memory and print it

set(0, 9)             // set register 0 (aka "counter") to 9
str('Count: 9\n', 1)  // write string to memory from reg 1 to reg 9 (1 + 8)
whileFnc(0, () => {   // loop until reg 0 is set to 0
  print(1, 9)         // print reg 1 to reg 9 as ascii string
  mod(8, -1)          // decrement ASCII value of the number in the string
  mod(0, -1)          // decrement "counter" by 1
})
```

## Usage

```sh
$ npm i -g bf-improved # install the CLI
$ bfm bfm example.bfm example.bf # compile BrainFuck Improved to Brainfuck
$ bfm bf example.bf # execute Brainfuck
$ bfm bftoc example.bf example.c # generate C code from BrainFuck
$ gcc example.c -o example # generate Executable
$ ./example # launch
```

## Syntax

### `goto(reg)`

Generates bf code to move from cur reg to new reg. Throws if arg is not a valid number
> Example: `goto(1); goto(20);` => `>>>>>>>>>>>>>>>>>>>>`

### `mod(reg, val)`

Modifies the value of a reg
> Example: `mod(20, 2);` => `goto(20); bf('++');`

### `clear(reg)`

Clears a registers value
> Alias: `clear(reg);` => `goto(reg); bf('[-]');`

### `set(reg, val)`

Sets value of reg to val
> Alias: `clear(reg); mod(reg, val);`

### `whileFnc(reg, fnc)`

Brainfuck native loop. Calls goto before and after code.
> Example: `mod(0, 1); set(1, 2); while(0, () => { clear(1) })` => `+>++<[>[-]<]`

### `str(str, reg)`

Sets all registers from `reg` to `reg + str.length` to the ASCII values of str
> Example: `str('H', 20);` => `goto(20); set(20, 72);`

### `print(reg, len)`

Prints char at reg (`.`)
Optionally prints `len` next cells too
> Example: `print(0, 3);` => `.>.>.>.`

### `strprint(str, reg)`

Writes string into memory then prints it
> Example: `strprint('Hello', 20)` => `str('Hello', 20); print(20, 25);`

### `numprint(reg, storeReg)` **TODO**

Prints the ASCII value of the number stored at reg using storeReg.
Note: There must be at least 10 free cells after storeReg to avoid corruption for big numbers
