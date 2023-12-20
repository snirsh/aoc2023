import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split("\n").map(line => {
  const [s, d] = line.split(" -> ")
  const type = s.match(/%|&/) ? s.match(/%|&/)[0] : 'broadcaster'
  return {
    s: s.replace(type, '') || 'broadcaster',
    d: d.split(',').map(s => s.trim()),
    type,
    inputs: new Set(),
    state: false,
    lastPulses: {},
  }
}).reduce((acc, m) => {
  acc[m.s] = m
  return acc
}, {})

let buttonPresses = 0
const listeners = ['vg', 'kp', 'gc', 'tx'].reduce((acc, s) => {
  acc[s] = 0
  return acc
}, {})

const sendPulse = (modules, part=false) => {
  const state = {source: "button", destination: "broadcaster", pulse: false}
  const queue = [state]
  let lows = 0
  let highs = 0
  while (queue.length) {
    const {source, destination, pulse} = queue.shift()
    const sourceModule = modules[source]
    const module = modules[destination]
    const moduleType = sourceModule?.type === 'broadcaster' ? '' : sourceModule?.type ?? ''
    // console.log(`${moduleType}${source} -${pulse ? 'high' : 'low'}-> ${destination}`)
    lows += pulse ? 1 : 0
    highs += pulse ? 0 : 1
    if (!module) { continue }
    if (module.type === 'broadcaster') {
      modules[destination].d.forEach(d => {
        queue.push({source: destination, destination: d, pulse})
      })
    } else if (module.type === '%') {
      if (pulse) { continue }
      module.state = !module.state
      module.d.forEach(d => {
        queue.push({source: destination, destination: d, pulse: module.state})
      })
    } else if (module.type === '&') {
      module.lastPulses[source] = pulse
      module.state = !Object.values(module.lastPulses).every(Boolean)
      module.d.forEach(d => {
        queue.push({source: destination, destination: d, pulse: module.state})
      })
      if (destination === 'bq') {
        const v = listeners[source]
        if (v === 0 && pulse) {
          listeners[source] = buttonPresses
        }
      }
    }
  }
  return { highs, lows }
}

const initialize = (modules) => {
  for (const module of Object.values(modules)) {
    module.state = false
    module.inputs = new Set(Object.values(modules).filter(m => m.d.includes(module.s)).map(m => m.s))
    module.lastPulses = Array.from(module.inputs).map(i => [i, false]).reduce((acc, [k, v]) => {
      acc[k] = v
      return acc
    }, {})
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  initialize(input)
  let total = {highs: 0, lows: 0}
  for (let i = 0; i<1000; i++) {
    const {highs, lows} = sendPulse(input)
    total.highs += highs
    total.lows += lows
  }
  return Object.values(total).reduce((acc, v) => acc * v, 1)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  initialize(input)
  const bqInputs = Object.values(input).filter(m => m.d.includes('bq')).map(m => m.s)

  while (Object.values(listeners).some(v => v  === 0)) {
    buttonPresses++
    sendPulse(input)
  }
  return Object.values(listeners).reduce((acc, v) => acc * v, 1)
}

run({
  part1: {
    tests: [
      {
        input: `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
        expected: 32_000_000,
      },
      {
        input: `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
        expected: 11_687_500,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
