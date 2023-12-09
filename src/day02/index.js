import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n')

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const games = {}
  input.forEach((row) => {
    const [game, cubes] = row.split(':')
    const gameNumber = game.split(' ')[1]
    games[gameNumber.toString()] = cubes
  })
  const gamesAndScores = {}
  Object.entries(games).forEach(([g,r]) => {
    const splittedRow = r.split(';').map(r => r.split(','))
    const rgb = {'red': 0, 'green': 0, 'blue': 0}
    for (const rolls of splittedRow) {
      for (const roll of rolls) {
        const num = parseInt(roll.match(/\d+/g)[0])
        if (roll.match('red')) {
          rgb['red'] = rgb['red'] > num ? rgb['red'] : num
        } else if (roll.match('blue')) {
          rgb['blue'] = rgb['blue'] > num ? rgb['blue'] : num
        } else if (roll.match('green')) {
          rgb['green'] = rgb['green'] > num ? rgb['green'] : num
        }
      }
    }
    gamesAndScores[g] = rgb
  })
  const validGames = Object.entries(gamesAndScores).map(([g,r]) => {
    if (r['red'] <= 12 && r['blue'] <= 14 && r['green'] <= 13) {
      return g
    }
  }).filter(g => g !== undefined).reduce((acc, curr) => acc + parseInt(curr), 0)
  return validGames
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const games = {}
  input.forEach((row) => {
    const [game, cubes] = row.split(':')
    const gameNumber = game.split(' ')[1]
    games[gameNumber.toString()] = cubes
  })
  const gamesAndScores = {}
  Object.entries(games).forEach(([g,r]) => {
    const splittedRow = r.split(';').map(r => r.split(','))
    const rgb = {'red': 0, 'green': 0, 'blue': 0}
    for (const rolls of splittedRow) {
      for (const roll of rolls) {
        const num = parseInt(roll.match(/\d+/g)[0])
        if (roll.match('red')) {
          rgb['red'] = rgb['red'] > num ? rgb['red'] : num
        } else if (roll.match('blue')) {
          rgb['blue'] = rgb['blue'] > num ? rgb['blue'] : num
        } else if (roll.match('green')) {
          rgb['green'] = rgb['green'] > num ? rgb['green'] : num
        }
      }
    }
    gamesAndScores[g] = rgb
  })
  const validGames = Object.entries(gamesAndScores).map(([g,r]) => {
    return Object.values(r).reduce((acc, curr) => acc * curr, 1)
  }).reduce((acc, curr) => acc + parseInt(curr), 0)
  return validGames
}

run({
  part1: {
    tests: [
//       {
//         input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
//         expected: 8,
//       },
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
