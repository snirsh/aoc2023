import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n')

function greatestCommonDivisor(a, b) {
    if (b === 0) return a;
    return greatestCommonDivisor(b, a % b);
}

// lcm
function leastCommonMultiple(array) {
    let n = 1;
    for (let i = 0; i < array.length; i++) {
        n *= array[i] / greatestCommonDivisor(n, array[i]);
    }
    return n;
}

const parseTree = (rows) => {
  const tree = {}
  for (const row of rows) {
    const [root, L, R] = row.match(/(\w+)/g)
    tree[root] = { L, R }
  }
  return tree
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const instructions = input[0]
  const tree = parseTree(input.slice(2))
  let currentNode = "AAA"
  let i = 0
  while (currentNode !== "ZZZ") {
    const instruction = instructions[i % instructions.length]
    currentNode = tree[currentNode][instruction]
    i++
  }
  return i
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const instructions = input[0]
  const tree = parseTree(input.slice(2))
  let startingPositions = Object.keys(tree).filter(k => k.endsWith('A')).reduce((acc, c) => {
    acc.push({c: 0, v: c})
    return acc
  }, [])
  let i = 0
  while (startingPositions.filter(s => s.v.endsWith('Z')).length !== startingPositions.length) {
    const instruction = instructions[i % instructions.length]
    startingPositions.forEach(s => {
        if (s.v.endsWith('Z')) return
        s.c += 1
        s.v = tree[s.v][instruction]
    })
    i++
  }
  const counters = startingPositions.map(s => s.c)
  const min = Math.min(...counters)
  const max = Math.max(...counters)
  return leastCommonMultiple(counters)
}

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
