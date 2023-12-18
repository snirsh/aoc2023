import run from "aocrunner"

const rowRegex = /([RLUD])\s(\d+)\s\((#[0-9a-f]{6})\)/

const parseInput = (rawInput) => rawInput.split("\n").map(l => l.match(rowRegex)).map(([, direction, distance, color]) => ({ direction, distance, color }))

const Directions = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
}

const det = (a, b) => {
  return (a[0] * b[1]) - (a[1] * b[0])
}

const numberToDirection = (n) => {
  switch (n) {
    case 0: return "R"
    case 1: return "D"
    case 2: return "L"
    case 3: return "U"
  }
}

function getDistAndDirFromColor(color) {
  const hex = color.split('#')[1]
  const r = hex.slice(0, 5)
  const l = hex.slice(5)
  const dir = numberToDirection(+l)
  const dist = parseInt(r, 16)
  return { distance: dist, direction: dir }
}

const process = (rows) => {
  const start = [0,0]
  let area = 0
  let points = 0
  for (const { distance, direction } of rows) {
    const [nx, ny] = Directions[direction]
    for (let i = 0; i < distance; i++) {
      area += 0.5 * det([start[0], start[1]], [start[0] + nx, start[1] + ny])
      start[0] += nx
      start[1] += ny
      points++
    }
  }

  return Math.abs(area) + points / 2  + 1
}


const part1 = (rawInput) => {
  const rows = parseInput(rawInput)
  return process(rows)
}

const part2 = (rawInput) => {
  const rows = parseInput(rawInput).map(({ color, ..._}) => getDistAndDirFromColor(color))
  return process(rows)
}

run({
  part1: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
