import run from "aocrunner"

const parseInput = (rawInput) => rawInput
const getRows = (rawInput) => rawInput.split("\n")

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  let result = 0
  for (const row of getRows(input)) {
    const numbers = []
    const matches = row.match(/(\d)/g)
    if (matches.length === 0) {
      numbers.push(0)
    } else {
      numbers.push(matches[0], matches[matches.length - 1])
    }
    result += parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`)
    numbers.length = 0
  }

  return result
}

const numbersTranslation = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  let result = []
  for (const row of getRows(input)) {
    const rowNumbers = []
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (char === " ") {
        continue
      }
      if (char.match(/\d/)) {
        rowNumbers.push(char)
      } else if (i + 2 < row.length) {
        const rowSplit = row.slice(i)
        for (const wordNum of Object.keys(numbersTranslation)) {
          if (rowSplit.startsWith(wordNum)) {
            rowNumbers.push(numbersTranslation[wordNum].toString())
            i += wordNum.length - 2
            break
          }
        }
      }
    }
    result.push(parseInt(rowNumbers.join("")))
  }
  return result.reduce((acc, curr) => acc + curr, 0)
}

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `eighthree\nsevenine`,
        expected: 83+79,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
