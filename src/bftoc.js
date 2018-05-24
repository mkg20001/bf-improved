'use strict'

let VALID = /[,.+\[\]><-]/
const MAP_MEM = {'>': '+', '<': '-'}

function bftoc (rawBf) {
  // Rewritten in JS. Original: https://github.com/paulkaefer/bftoc/blob/master/bftoc.py
  let posSize = 1
  let negSize = 1

  let out = []
  let bf = rawBf.split('').filter(r => r.match(VALID)).map(v => {
    if (v === '>') posSize++
    if (v === '<') negSize++
    return v
  }).join('')

  let size = Math.max(posSize, negSize)

  let tab = 0
  let code = (...c) => c.forEach(c => out.push(' '.repeat(tab * 4) + c))

  code('/* Generated by bf-improved brainfuck to c compiler at ' + Date() + ' */\n')
  code('#include <stdio.h>', '')
  code('void main(void)', '{')

  tab++

  code('int size = ' + size + ';')
  code('int tape[size];')
  code('int i = 0;', '')
  code('/* Clearing the tape (array) */', 'for (i=0; i<size; i++)', '    tape[i] = 0;', '')
  code('int ptr = 0;', '')

  let c = 0
  let lc = ''
  let red = bf.split('').reduce((a, b) => { // sum chars together (ex: [['+'. 24], ['-', 27]])
    if (lc !== b) {
      if (c) {
        a.push([lc, c])
      }
      lc = b
      c = 1
    } else c++
    return a
  }, [])
  red.push([lc, c])

  red.forEach(r => {
    let [char, count] = r
    switch (char) {
      case '+':
      case '-':
        code('tape[ptr] ' + char + '= ' + count + ';')
        break
      case '>':
      case '<':
        code('ptr ' + MAP_MEM[char] + '= ' + count + ';')
        break
      default: {
        while (count--) { // non-repeatable sequences
          switch (char) {
            case ',': // self-overwriting, but somebody might actually depend on that
              code('tape[ptr] = getchar();')
              break
            case '.':
              code('printf("%c",tape[ptr]);')
              break
            case '[':
              code('while (tape[ptr] != 0)', '{')
              tab++
              break
            case ']':
              tab--
              code('}')
              break
          }
        }
      }
    }
  })

  tab--

  code('', '}', '')

  return out.join('\n')
}

module.exports = bftoc
