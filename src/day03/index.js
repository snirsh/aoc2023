import run from "aocrunner"

const parseInput = (rawInput) => rawInput

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const matrix = []
  // pattern for anything that is not a number or a "." is a "symbol"
  const specialChars = /\D/
  // create matrix
  for (const row of input.split('\n')) {
    let rowChars = []
    for (const char of row.split('')) {
      rowChars.push(char)
    }
    matrix.push(rowChars)
  }
  const specialNumbers = {}

  for(let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      const row = matrix[x]
      const cell = row[y]
      // check if cell is a number or a "."
      if (cell.match(/\d|\./)) {
        continue
      }
      // found a cell that is a "symbol"
      // get all adjacent cells
      const adjacentCells = {}
      // top left
      if (x > 0 && y > 0) {
        adjacentCells[`${x-1},${y-1}`] = matrix[x - 1][y - 1]
      }
      // top
      if (x > 0) {
          adjacentCells[`${x-1},${y}`] = matrix[x - 1][y]
      }
      // top right
      if (x > 0 && y < row.length - 1) {
          adjacentCells[`${x-1},${y+1}`] = matrix[x - 1][y + 1]
      }
      // left
      if (y > 0) {
          adjacentCells[`${x},${y-1}`] = matrix[x][y - 1]
      }
      // right
      if (y < row.length - 1) {
          adjacentCells[`${x},${y+1}`] = matrix[x][y + 1]
      }
      // bottom left
      if (x < matrix.length - 1 && y > 0) {
          adjacentCells[`${x+1},${y-1}`] = matrix[x + 1][y - 1]
      }
      // bottom
      if (x < matrix.length - 1) {
          adjacentCells[`${x+1},${y}`] = matrix[x + 1][y]
      }
      // bottom right
      if (x < matrix.length - 1 && y < row.length - 1) {
          adjacentCells[`${x+1},${y+1}`] = matrix[x + 1][y + 1]
      }
      // check if any adjacent cells are numbers
      // if so, add to specialNumbers as startCoord : number
      Object.entries(adjacentCells).forEach(([coord, char]) => {
        const [x,y] = coord.split(',').map((n) => parseInt(n))
        if (char.match(/\d/)) {
          const leftSide = matrix[x].slice(0, y).join('').split(specialChars).reverse()[0]
          const startCoord = `${x},${y - leftSide.length}`
          if (specialNumbers[startCoord]) {
            return
          }
          const rightSide = matrix[x].slice(y + 1).join('').split(specialChars)[0]
          specialNumbers[startCoord] = parseInt(`${leftSide}${char}${rightSide}`)
        }
      })
    }
  }

  return Object.values(specialNumbers).reduce((a, b) => a + b, 0)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const matrix = []
  let result = 0
  // pattern for anything that is not a number or a "." is a "symbol"
  const specialChars = /\D/
  // create matrix
  for (const row of input.split('\n')) {
    let rowChars = []
    for (const char of row.split('')) {
      rowChars.push(char)
    }
    matrix.push(rowChars)
  }

  for(let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      const specialNumbers = {}
      const row = matrix[x]
      const cell = row[y]
      // check if cell is a number or a "."
      if (cell === '*') {
        // found a cell that is a "symbol"
        const adjacentCells = {}
        // top left
        if (x > 0 && y > 0) {
          adjacentCells[`${x-1},${y-1}`] = matrix[x - 1][y - 1]
        }
        // top
        if (x > 0) {
          adjacentCells[`${x-1},${y}`] = matrix[x - 1][y]
        }
        // top right
        if (x > 0 && y < row.length - 1) {
          adjacentCells[`${x-1},${y+1}`] = matrix[x - 1][y + 1]
        }
        // left
        if (y > 0) {
          adjacentCells[`${x},${y-1}`] = matrix[x][y - 1]
        }
        // right
        if (y < row.length - 1) {
          adjacentCells[`${x},${y+1}`] = matrix[x][y + 1]
        }
        // bottom left
        if (x < matrix.length - 1 && y > 0) {
          adjacentCells[`${x+1},${y-1}`] = matrix[x + 1][y - 1]
        }
        // bottom
        if (x < matrix.length - 1) {
          adjacentCells[`${x+1},${y}`] = matrix[x + 1][y]
        }
        // bottom right
        if (x < matrix.length - 1 && y < row.length - 1) {
          adjacentCells[`${x+1},${y+1}`] = matrix[x + 1][y + 1]
        }
        // check if any adjacent cells are numbers
        // if so, add to specialNumbers as startCoord : number
        Object.entries(adjacentCells).forEach(([coord, char]) => {
          const [x,y] = coord.split(',').map((n) => parseInt(n))
          if (char.match(/\d/)) {
            const leftSide = matrix[x].slice(0, y).join('').split(specialChars).reverse()[0]
            const startCoord = `${x},${y - leftSide.length}`
            if (specialNumbers[startCoord]) {
              return
            }
            const rightSide = matrix[x].slice(y + 1).join('').split(specialChars)[0]
            specialNumbers[startCoord] = parseInt(`${leftSide}${char}${rightSide}`)
          }
        })
        if (Object.keys(specialNumbers).length !== 2) {
          continue
        }
        result += Object.values(specialNumbers).reduce((a, b) => a * b, 1)
      }
    }
  }

  return result
}

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
      {
        input: `.9.`,
        expected: 0,
      },
      {
        input: `$9.`,
        expected: 9,
      },
      {
        input: `.9$`,
        expected: 9,
      },
      {
        input: `9$.`,
        expected: 9,
      },
      {
        input: `9.$`,
        expected: 0,
      },
      {
        input: `$.9`,
        expected: 0,
      },
      {
        input: `9..9`,
        expected: 0,
      },
      {
        input: `9$.9`,
        expected: 9,
      },
      {
        input: `9..9
*..*`,
        expected: 18,
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `*9`,
        expected: 0,
      },
      {
        input: `*9\n9.`,
        expected: 81,
      },
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
