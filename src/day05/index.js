import run from "aocrunner"
import {create} from "domain";

const parseInput = (rawInput) => rawInput.split('\n')

function createRanges(input, index) {
  let minSource = Infinity
  let maxSource = -Infinity
  let minDest = Infinity
  let maxDest = -Infinity

  let currentRow = input[index]
  while (currentRow !== '') {
    index++
    const [y, x, d] = currentRow.split(' ').map(Number)
    minSource = Math.min(minSource, x)
    maxSource = Math.max(maxSource, x + d)
    minDest = Math.min(minDest, y)
    maxDest = Math.max(maxDest, y + d)
    currentRow = input[index]
  }
  return {minSource, maxSource, minDest, maxDest}
}

function extracted(input, seedsInput) {
  const seeds = {...seedsInput}
  for (let i = input.indexOf('seed-to-soil map:') + 1; i < input.length; i++) {
    const currentRow = input[i]
    if (currentRow === '') {
      // replace keys with values
      Object.entries(seeds).forEach(([k, v]) => {
        if (k !== v.toString()) {
          delete seeds[k]
        }
        seeds[v] = v
      })
      continue
    }
    if (currentRow.match(/\d/)) {
      const [y, x, d] = currentRow.split(' ').map(Number)
      Object.keys(seeds).forEach((seedStr) => {
        const seed = parseInt(seedStr)
        if (seed >= x && seed < x + d) {
          seeds[seed.toString()] = y + (seed - x)
        }
      })
    }
  }
  return seeds
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const seeds = input[0].split(':')[1].trim().split(' ').map(Number).reduce((acc, seed) => {
    acc[seed] = seed
    return acc
  }, {})
  const parsedSeeds = extracted(input, seeds);
  return Math.min(...Object.values(parsedSeeds))
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const preSeeds = input[0].split(':')[1].trim().split(' ').map(Number)
  const seedRanges = []
  for (let i=0; i < preSeeds.length; i+=2) {
    const range = [preSeeds[i], preSeeds[i]+preSeeds[i+1]]
    seedRanges.push(range)
  }
  seedRanges.sort(([aMin, aMax], [bMin, bMax]) => {
    if (aMin < bMin) {
      return -1
    }
    if (aMin > bMin) {
      return 1
    }
    return 0
  })
   const splits = [
    input.indexOf("seed-to-soil map:"),
    input.indexOf("soil-to-fertilizer map:"),
    input.indexOf("fertilizer-to-water map:"),
    input.indexOf("water-to-light map:"),
    input.indexOf("light-to-temperature map:"),
    input.indexOf("temperature-to-humidity map:"),
    input.indexOf("humidity-to-location map:"),
    input.length + 1
  ]
  const maps = []
  let minMap = Infinity
  splits.forEach((split, i) => {
    if (i === splits.length - 1) {
      return
    }
    maps.push(input.slice(split + 1, splits[i + 1] - 1).map((row) => row.split(' ').map(Number)))
    minMap = Math.min(minMap, maps[i][0][0])
  })

  const inverseSeedLocation = (location) => {
    for (let i = maps.length - 1; i >= 0; i--) {
      const map = maps[i]
      for (let j = map.length - 1; j >= 0; j--) {
        const [y, x, d] = map[j]
        if (location >= y && location < y + d) {
          location = x + (location - y)
          break
        }
      }
    }
    return location
  }
  // find the smallest seed that is in the map
  let n = 0
  while (true) {
    const seed = inverseSeedLocation(n)
    for (const [min, max] of seedRanges) {
      if (seed >= min && seed < max) {
        return n
      }
    }
    n++
  }
}
run({
  part1: {
    tests: [
//       {
//         input: `seeds: 79 14 55 13
//
// seed-to-soil map:
// 50 98 2
// 52 50 48
//
// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15
//
// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4
//
// water-to-light map:
// 88 18 7
// 18 25 70
//
// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13
//
// temperature-to-humidity map:
// 0 69 1
// 1 0 69
//
// humidity-to-location map:
// 60 56 37
// 56 93 4`,
//         expected: 35,
//       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
