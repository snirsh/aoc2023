import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split("\n").map(line => line.split(""))

const mod = (n, m) => ((n % m) + m) % m

const Directions = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
}

const getAdjacent = (x, y, input, part = false) => {
  const adjacent = []
  Object.values(Directions).forEach(({ x: dx, y: dy }) => {
    const nx = mod(x + dx, input[0].length)
    const ny = mod(y + dy, input.length)
    if (input[ny][nx] !== "#") {
      adjacent.push({ x: x+dx, y: y+dy })
    }
  })
  return adjacent
}

const BFS = (input, x, y, maxDepth) => {
  const visited = new Set()
  const queue = [{ x, y, depth: 0 }]
  while (queue.length) {
    const { x, y, depth } = queue.shift()
    if (depth > maxDepth) {
      continue
    }
    const key = `${x},${y},${depth}`
    if (visited.has(key)) {
      continue
    }
    visited.add(key)
    getAdjacent(x, y, input).forEach(({ x, y }) => {
      queue.push({ x, y, depth: depth + 1 })
    })
  }
  return Array.from(visited).map(v => +v.split(",")[2]).filter(v => v === maxDepth).length
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const x = input.findIndex(line => line.includes("S"))
  const y = input[x].findIndex(v => v === "S")
  return BFS(input, x, y, 64)
}


function calculateQuadraticValue(n, a0, a1, a2) {
  const b0 = a0
  const b1 = a1 - a0
  const b2 = a2 - a1
  return b0 + (b1 * n) + ((b2-b1) * n * (n - 1) / 2)
}

const processPart2 = (grid) => {
  // Grid dimensions
  const n = grid.length
  const m = grid[0].length

  // Find starting points
  let q = {}

  // Goal - the number of steps to simulate
  const goal = 26501365

  // Simulate the steps
  let prev_len = 0
  const a = []
  q = {}
  q[0] = new Set()
  const x = grid.findIndex(line => line.includes("S"))
  const y = grid[x].findIndex(v => v === "S")
  q[0].add(`${x},${y}`)
  for (let s = 0; s < goal; s++) {
    for (const p of q[s]) {
      const [x,y] = p.split(",").map(Number)
      const adjacent = getAdjacent(x, y, grid, true)
      for (const {x: nx, y: ny} of adjacent) {
        if (q[s+1] === undefined) {
          q[s+1] = new Set()
        }
        q[s+1].add(`${nx},${ny}`)
      }
    }
    if (mod(s,n) === mod(goal,n)){
      // console.log(s, q[s].size, q[s].size - prev_len, Math.round(s/n))
      prev_len = q[s].size
      a.push(prev_len)
    }
    if (a.length === 3){
      break
    }
  }

  return calculateQuadraticValue(Math.round(goal/n), ...a)
}

const part2 = (rawInput) => {
  const grid = parseInput(rawInput)

  return processPart2(grid)
}

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
