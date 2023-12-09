import run from "aocrunner"

const parseInput = (rawInput) => rawInput
const getRows = (rawInput) => rawInput.split("\n")

function findNumberWords(text) {
  const numberWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  let matches = [];
  let remainingText = text;

  numberWords.forEach(word => {
    const wordRegex = new RegExp(word, "gi");
    let match;

    while ((match = wordRegex.exec(remainingText)) !== null) {
      matches.push(match[0]);
      // Update the remaining text, removing the matched part
      let matchIndex = remainingText.indexOf(match[0]);
      remainingText = remainingText.slice(0, matchIndex) + remainingText.slice(matchIndex + match[0].length);
      // Reset the lastIndex of the regex to start from the beginning of the updated remaining text
      wordRegex.lastIndex = 0;
    }
  });

  return matches;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  let result = 0
  for (const row of getRows(input)) {
    const numbers = []
    // get first and last number in the string
    const matches = row.match(/(\d)/g)
    // only push first and last and if there's none push 0 if there's one push it twice
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
    const matches = findNumberWords(row)
    const firstAndLastMatches = [matches[0], matches[matches.length - 1]]
    const translated = firstAndLastMatches.map(c => {
      let num = parseInt(c)
      if (isNaN(num)) {
        return `${numbersTranslation[c]}`
      }
      return `${num}`
    })
    const res = parseInt(`${translated.join('')}`)
    result.push(res)
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
  onlyTests: true,
})
