'use strict'

function lexer (a) {
  let i = 0
  let o = []
  while(a.length > i) {
    let c = a[i]
    i++
    switch(c) {
      case '+':
      case '-':
        o.push({type: 'arth', c})
        break
      case '>':
      case '<':
        o.push({type: 'mem', c})
        break
      case '[':
      case ']':
        o.push({type: 'loop', c})
        break
      case '.':
      case ',':
        o.push({type: 'io', c})
        break
    }
  }
  return o
}

function recursor (t) {
  let i = 0
  let o = []
  let ai = {'+': 1, '-': -1, '>': 1, '<': -1, '.': 'print', ',': 'read', '[': true, ']': false}

  function walk() {
    let c = t[i]
    i++
    switch(c.type) {
      case 'arth': case 'mem': case 'io': return {type: c.type, params: ai[c.c]}
      case 'loop': {
        if (ai[c.c]) {
          let next
          let p = []
          while((next = walk())) {
            p.push(next)
          }
          return {type: 'loop', params: p}
        } else {
          return null
        }
      }
      default: throw new TypeError(c.type)
    }
  }

  let ast = []
  while(t.length > i) {
    ast.push(walk())
  }
  return ast
}

function executor (a, mem) {
  mem = mem || []
  let point = 0
  const ac = () => (mem[point] || 0)
  const set = n => (mem[point] = n)
  const mod = c => (set(ac() + c))
  const print = () => process.stdout.write(String.fromCharCode(ac()))
  const read = () => set(0) // TODO: add
  const IO = {print, read}

  function d(a) {
    if (process.env.DEBUG_BF) console.log(a)
    a.forEach(op => {
      switch(op.type) {
        case 'arth': return mod(op.params)
        case 'mem': return (point = point + op.params)
        case 'io': return IO[op.params]()
        case 'loop': {
          while(ac()) d(op.params)
          return
        }
      }
    })
  }

  d(a)

  return mem
}

function doEverything (str) {
  return executor(recursor(lexer(str)))
}

module.exports = doEverything
Object.assign(module.exports, {lexer, recursor, executor})
