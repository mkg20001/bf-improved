# bf-improved

Brainfuck Improved

## How

BFM is a JS based language that makes brainfuck development easier.

## Examples

```js
set(0, 1)
whileFnc(0, () => { // loop is useless, just here for demo
  strprint('Hello World!\n', 1)
//  strprint('First ASCII char: ', 30) // numprint is TODO
//  numprint(1)
//  strprint('\n', 30)
  clear(0) // clear reg 0 to end loop
})
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

### `numprint(reg, storeReg)`

Prints the ASCII value of the number stored at reg using storeReg.
Note: There must be at least 10 free cells after storeReg to avoid corruption for big numbers

