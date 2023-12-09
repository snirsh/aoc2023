import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n')
const runRace = (time, speed) => {
  return (time-speed) * speed
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const times = input[0].split(':')[1].trim().split(/\s+/).map(Number)
  const distances = input[1].split(':')[1].trim().split(/\s+/).map(Number)


  const totalWins = []
  for (let i = 0; i < times.length; i++) {
    const time = times[i]
    const raceOptions = Array.from(Array(time+1).keys())
    const waysToWin = raceOptions.map((speed) => runRace(time, speed)).filter(r => r > distances[i])
    totalWins.push(waysToWin.length)
  }
  return totalWins.reduce((a, b) => a * b, 1)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const time = parseInt(input[0].split(':')[1].trim().split(/\s+/).join(''))
  const distance = parseInt(input[1].split(':')[1].trim().split(/\s+/).join(''))
  const raceOptions = Array.from(Array(time+1).keys())
  return raceOptions.map((speed) => runRace(time, speed)).filter(r => r > distance).length
}

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
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
