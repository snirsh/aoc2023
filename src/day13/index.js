import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split("\n\n").map((g) => g.split("\n").map((r) => r.split("")))

function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function diff(a, b) {
  return a.filter((c, i) => c !== b[i]).length;
}

function calculateDiff(grid, part) {
  let maxIndex = 0;

  for (let i = 0; i < grid.length; i++) {
    let diffSum = 0, j = 0;

    while (i - j >= 0 && i + j + 1 < grid.length) {
      diffSum += diff(grid[i - j], grid[i + j + 1]);
      if (part === 2 && diffSum > 1) break;
      j++;
    }

    const withinBounds = i - j === -1 || i + j + 1 === grid.length;
    const validDiff = part === 1 ? diffSum === 0 : diffSum === 1;

    if (j > 0 && withinBounds && validDiff) {
      maxIndex = i + 1;
    }
  }

  return maxIndex;
}



function process(data, part = 1) {
  return data
    .map(grid => [grid, transpose(grid)])
    .map(grids => grids.map(grid => calculateDiff(grid, part)))
    .reduce((accumulator, current) => accumulator + current[0] * 100 + current[1], 0);
}


const part1 = (rawInput) => {
  const matrices = parseInput(rawInput)
  return process(matrices)
}

const part2 = (rawInput) => {
  const matrices = parseInput(rawInput)
  return process(matrices, 2)
}

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `#.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.
//
// #...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#`,
//         expected: 1067,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
