import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n').map(r => r.split(' ').map(Number))

const findDifferences = (arr) => {
  const differences = []
  for (let i = 1; i < arr.length; i++) {
    differences.push(arr[i] - arr[i - 1])
  }
  return differences
}

function getExtrapolationResults(histories) {
  const results = []
  for (const history of histories) {
    const extrapolations = [history]
    while (!extrapolations[extrapolations.length - 1].every(c => c === 0)) {
      extrapolations.push(findDifferences(extrapolations[extrapolations.length - 1]))
    }
    for (let i = extrapolations.length - 1; i > 0; i--) {
      const lastExt = extrapolations[i]
      const nextExt = extrapolations[i - 1]
      nextExt.push(nextExt[nextExt.length - 1] + lastExt[lastExt.length - 1])
    }
    results.push(extrapolations[0][extrapolations[0].length - 1])
  }
  return results
}

const part1 = (rawInput) => {
  const histories = parseInput(rawInput)
  const results = getExtrapolationResults(histories);

  return results.reduce((acc, cur) => acc + cur, 0)
}

const part2 = (rawInput) => {
  const histories = parseInput(rawInput)
  const results = getExtrapolationResults(histories.map(h=>h.reverse()));

  return results.reduce((acc, cur) => acc + cur, 0)
}

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `10 13 16 21 30 45
10 13 16 21 30 45`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
