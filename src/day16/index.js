import run from "aocrunner"
import { start } from "repl"

const parseInput = (rawInput) => rawInput.split("\n").map(l => l.split(''))

const Directions = {
  up: (x, y) => [x, y - 1],
  right: (x, y) => [x + 1, y],
  down: (x, y) => [x, y + 1],
  left: (x, y) => [x - 1, y],
}

const Point = (x, y, d) => ({ x, y, d })

function process(rawInput, startingPoint=Point(-1, 0, "right")) {
  const rows = parseInput(rawInput)
  const visited = new Set()
  const newRows = rows.map(r => r.join("").replace(/\W/g, ".").split(""))
  const beams = [startingPoint]
  while (beams.length > 0) {
    for (const beam of beams) {
      const { x, y, d } = beam
      const [nx, ny] = Directions[d](x, y)
      if (nx < 0 || nx === rows[0].length || ny < 0 || ny === rows.length) {
        beams.splice(beams.indexOf(beam), 1)
        break
      }
      if (visited.has(`${nx},${ny},${d}`)) {
        beams.splice(beams.indexOf(beam), 1)
        break
      }
      const currentCell = rows[ny][nx]
      visited.add(`${nx},${ny},${d}`)
      newRows[ny][nx] = "#"
      if (currentCell === ".") {
        beam.x = nx
        beam.y = ny
        break
      }
      if (currentCell === "|") {
        if (d === "up" || d === "down") {
          beam.x = nx
          beam.y = ny
          break
        } else {
          beam.x = nx
          beam.y = ny
          beam.d = "up"
          beams.push(Point(nx, ny, "down"))
          break
        }
      }
      if (currentCell === "-") {
        if (d === "right" || d === "left") {
          beam.x = nx
          beam.y = ny
          break
        } else {
          beam.x = nx
          beam.y = ny
          beam.d = "right"
          beams.push(Point(nx, ny, "left"))
          break
        }
      }
      if (currentCell === "/") {
        if (d === "up") {
          beam.x = nx
          beam.y = ny
          beam.d = "right"
          break
        }
        if (d === "right") {
          beam.x = nx
          beam.y = ny
          beam.d = "up"
          break
        }
        if (d === "down") {
          beam.x = nx
          beam.y = ny
          beam.d = "left"
          break
        }
        if (d === "left") {
          beam.x = nx
          beam.y = ny
          beam.d = "down"
          break
        }
      }
      if (currentCell === "\\") {
        if (d === "up") {
          beam.x = nx
          beam.y = ny
          beam.d = "left"
          break
        }
        if (d === "right") {
          beam.x = nx
          beam.y = ny
          beam.d = "down"
          break
        }
        if (d === "down") {
          beam.x = nx
          beam.y = ny
          beam.d = "right"
          break
        }
        if (d === "left") {
          beam.x = nx
          beam.y = ny
          beam.d = "up"
          break
        }
      }
    }
  }

  return newRows.map(r => r.join("")).join("").split("").filter(c => c === "#").length
}

const part1 = (rawInput) => {
  return process(rawInput)
}

const part2 = (rawInput) => {
  const rows = parseInput(rawInput)
  const firstRowCoordinates = rows[0].map((_, i) => [i, 0]).map(([x, y]) => Point(x, y-1, "down")).map(p => process(rawInput, p))
  const lastRowCoordinates = rows[rows.length - 1].map((_, i) => [i, rows.length - 1]).map(([x, y]) => Point(x, y+1, "up")).map(p => process(rawInput, p))
  const firstColumnCoordinates = rows.map((_, i) => [0, i]).map(([x, y]) => Point(x-1, y, "right")).map(p => process(rawInput, p))
  const lastColumnCoordinates = rows.map((_, i) => [rows[0].length - 1, i]).map(([x, y]) => Point(x+1, y, "left")).map(p => process(rawInput, p))

  return Math.max(...firstRowCoordinates, ...lastRowCoordinates, ...firstColumnCoordinates, ...lastColumnCoordinates)
}

run({
  part1: {
    tests: [
      {
        input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
