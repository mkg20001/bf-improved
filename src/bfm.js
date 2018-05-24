'use strict'

const vm = require('vm')

function Compile (code, debug) {
  let curReg = 0
  let out = ''

  let bfEscape = [[/\./g, '•'], [/[+,><\[\]-]/g, '']]

  function processStack (stack) {
    let s = stack.split('\n').slice(2).map(l => {
      let [fnc, loc] = l.substr(7).split(' (')
      let file = ''
      if (loc) {
        loc = loc.replace(/\)$/gmi, '').split(':')
        file = loc.shift()
        loc = loc.join(':')
        file = file.replace(__dirname, 'BFM')
      } else {
        loc = fnc.split(':')
        fnc = loc.shift()
        loc = loc.join(':')
        file = 'input.bfm'
      }
      return {fnc, loc, file}
    })
    let hf = false
    return s.filter(o => {
      if (hf) return
      hf = o.fnc === 'ContextifyScript.Script.runInContext'
      return !hf
    })
  }

  function getDebug () {
    let stack = processStack(new Error('.').stack)
    let out = stack.map(s => s.fnc + ' (' + s.file + ':' + s.loc + ')').join(' « ') + '\n'
    bfEscape.forEach(e => (out = out.replace(...e)))
    return out
  }

  const fncs = {
    bf: (s, hint) => (out += s + (debug ? ' // ' + (hint ? hint + ' @ ' : '') + getDebug() : '')),
    goto: reg => {
      if (typeof reg !== 'number' || isNaN(reg)) throw new Error('GOTO failed')
      let d = reg - curReg
      if (d > 0) fncs.bf('>'.repeat(d), 'goto ' + reg)
      if (d < 0) fncs.bf('<'.repeat(-d), 'goto ' + reg)
      curReg = reg
    },
    mod: (reg, val) => {
      fncs.goto(reg)
      if (val > 0) fncs.bf('+'.repeat(val), 'mod ' + reg + ' ' + val)
      if (val < 0) fncs.bf('-'.repeat(-val), 'mod ' + reg + ' ' + val)
    },
    clear: (reg) => {
      fncs.goto(reg)
      fncs.bf('[-]', 'clear ' + reg)
    },
    set: (reg, val) => {
      fncs.clear(reg)
      fncs.mod(reg, val)
    },
    whileFnc: (reg, inline) => {
      fncs.goto(reg)
      fncs.bf('[', 'while ' + reg)
      inline()
      fncs.goto(reg)
      fncs.bf(']', 'while ' + reg)
    },
    str: (str, start) => {
      str.split('').forEach((s, i) => {
        fncs.set(start + i, s.charCodeAt(0))
      })
    },
    print: (reg, len) => {
      fncs.goto(reg)
      if (!len) len = 1
      fncs.bf('.', 'print ' + reg)
      len--
      while (len--) {
        fncs.goto(++reg)
        fncs.bf('.', 'print ' + reg)
      }
    },
    strprint: (str, reg) => {
      fncs.str(str, reg)
      if (str.length > 1) fncs.print(reg, str.length, reg + str.length + 1)
      else if (str.length) fncs.print(reg)
    },
    numprint: () => {} // TODO: add
  }

  const ctx = vm.createContext(fncs)

  const script = new vm.Script(code)
  script.runInContext(ctx)

  return out
}

module.exports = Compile
