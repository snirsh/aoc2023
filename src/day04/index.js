import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n')

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const result = {}
  // for row we want to get card number and then leftNumbers and rightNumbers with Regex
  for (const row of input) {
    const cardNumber = row.split(':')[0].match(/\d+/g)
    const leftNumbers = row.split(':')[1].split('|')[0].match(/\d+/g)
    const rightNumbers = row.split(':')[1].split('|')[1].match(/\d+/g)
    const cards = cardNumber.reduce((acc, curr) => {
      acc[curr] = {
        win: leftNumbers,
        mine: rightNumbers
      }
      return acc
    }, {})

    for (const [n, card] of Object.entries(cards)) {
      const win = card.win
      const mine = card.mine
      const winCount = win.reduce((acc, curr) => {
        if (mine.includes(curr)) {
          acc++
        }
        return acc
      }, 0)
      if (winCount === 0) {
        result[n] = 0
        continue
      }
      result[n] = 2**(winCount - 1)
    }
  }
  return Object.values(result).reduce((a, b) => a + b, 0)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const result = {}
  // for row we want to get card number and then leftNumbers and rightNumbers with Regex
  for (const row of input) {
    const cardNumber = row.split(':')[0].match(/\d+/g)
    const leftNumbers = row.split(':')[1].split('|')[0].match(/\d+/g)
    const rightNumbers = row.split(':')[1].split('|')[1].match(/\d+/g)
    const cards = cardNumber.reduce((acc, curr) => {
      acc[curr] = {
        win: leftNumbers,
        mine: rightNumbers
      }
      return acc
    }, {})

    for (const [n, card] of Object.entries(cards)) {
      const win = card.win
      const mine = card.mine
      const winCount = win.reduce((acc, curr) => {
        if (mine.includes(curr)) {
          acc++
        }
        return acc
      }, 0)
      result[n] = winCount
    }
  }
  const scratches = Object.keys(result).reduce((acc, curr) => {
    acc[curr] = 1
    return acc
  }, {})
  for (const [n, count] of Object.entries(result)) {
    let currentCard = parseInt(n)
    let wins = count
    while (wins > 0) {
      if (currentCard !== parseInt(Object.keys(result)[Object.keys(result).length - 1])) {
        currentCard+=1
      }
      scratches[currentCard] += scratches[n]
      wins -= 1
    }
  }
    return Object.values(scratches).reduce((a, b) => a + b, 0)
}

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
