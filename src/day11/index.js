import run from "aocrunner";

const parseInput = (rawInput) => {
  const galaxies = [];
  const rows = [];
  const cols = [];

  const input = rawInput.split("\n").map(row => row.split(""));

  for (let i = 0; i < input.length; i++) {
    if (!input[i].includes("#")) {
      rows.push(i);
    }
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "#") {
        galaxies.push([i, j]);
      }
    }
  }

  for (let j = 0; j < input[0].length; j++) {
    if (!input.map((e) => e[j]).includes("#")) {
      cols.push(j);
    }
  }

  return { rows, cols, galaxies };
};

const process = (galaxies, rows, cols, expand) => {
  expand -= 1;
  const dist = [];

  for (let i = 0; i < galaxies.length; i++) {
    dist[i] = [];
    for (let j = i; j < galaxies.length; j++) {
      let colCount = 0;
      let rowCount = 0;

      for (let col of cols) {
        if (col > Math.min(galaxies[i][1], galaxies[j][1]) && col < Math.max(galaxies[i][1], galaxies[j][1])) {
          colCount++;
        }
      }

      for (let row of rows) {
        if (row > Math.min(galaxies[i][0], galaxies[j][0]) && row < Math.max(galaxies[i][0], galaxies[j][0])) {
          rowCount++;
        }
      }

      dist[i][j] = Math.abs(galaxies[i][0] - galaxies[j][0]) +
        Math.abs(galaxies[i][1] - galaxies[j][1]) +
        expand * colCount +
        expand * rowCount;
    }
  }

  return dist
    .map((e) => e.reduce((acc, cur) => acc + cur, 0))
    .reduce((acc, cur) => acc + cur, 0);
};

// Part 1 solution function
const part1 = (rawInput) => {
  const { rows, cols, galaxies } = parseInput(rawInput);
  return process(galaxies, rows, cols, 2);
};

// Part 2 solution function
const part2 = (rawInput) => {
  const { rows, cols, galaxies } = parseInput(rawInput);
  return process(galaxies, rows, cols, 1000000);
};

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
