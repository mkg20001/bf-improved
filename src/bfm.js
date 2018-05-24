'use strict'

const vm = require('vm')

function Compile(code) {
  let curReg = 0
  let out = ''

  const fncs = {
    bf: s => (out += s),
    goto: reg => {
      if (typeof reg !== 'Number' || isNaN(reg)) return
      let d = reg - curReg
      if (d > 0) fncs.bf('>'.repeat(d))
      if (d < 0) fncs.bf('<'.repeat(-d))
    },
    mod: (reg, val) => {
      fncs.goto(reg)
      if (val > 0) fncs.bf('+'.repeat(val))
      if (val < 0) fncs.bf('-'.repeat(-val))
    },
    clear: (reg) => {
      fncs.goto(reg)
      fncs.bf('[-]')
    },
    set: (reg, val) => {
      fncs.clear(reg)
      fncs.mod(reg, val)
    },
    whileFnc: (reg, inline) => {
      fncs.goto(reg)
      fncs.bf('[')
      inline()
      fncs.goto(reg)
      fncs.bf(']')
    },
    str: (str, start) => {
      str.split('').forEach((s, i) => {
        fncs.set(start + i, s.charCodeAt(0))
      })
    },
    print: (reg, len, lenReg) => {
      if (len && reg - len) {
        fncs.set(lenReg, reg - len)
        fncs.whileFnc(lenReg, () => {
          fncs.print(reg)
          fncs.mod(lenReg, -1)
        })
      } else {
        fncs.goto(reg)
        fncs.bf('.')
      }
    },
    strprint: (str, reg) => {
      fncs.str(str, reg)
      if (str.length > 1) fncs.print(reg, reg + str.length, reg + str.length + 1)
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
