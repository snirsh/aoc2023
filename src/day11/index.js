import run from "aocrunner";

const parseInput = (rawInput) => {
  const galaxies = [];
  const rows = [];
  const cols = [];

  const input = rawInput.split("\n").map(row => row.split(""));

  for (let j = 0; j < input[0].length; j++) {
    if (!input.map((e) => e[j]).includes("#")) {
      cols.push(j);
    }
  }

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

  return { rows, cols, galaxies };
};

const process = (galaxies, rows, cols, expand) => {
  galaxies.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let totalDistance = 0;
  let activeGalaxies = new Set();

  galaxies.forEach(galaxy => {
    activeGalaxies.forEach(otherGalaxy => {
      const minCol = Math.min(galaxy[1], otherGalaxy[1]);
      const maxCol = Math.max(galaxy[1], otherGalaxy[1]);
      const minRow = Math.min(galaxy[0], otherGalaxy[0]);
      const maxRow = Math.max(galaxy[0], otherGalaxy[0]);

      const colCount = cols.filter(col => col > minCol && col < maxCol).length;
      const rowCount = rows.filter(row => row > minRow && row < maxRow).length;
      // totalDistance = |x1 - x2| + |y1 - y2| + (expand - 1) * (colCount + rowCount)
      totalDistance += Math.abs(galaxy[0] - otherGalaxy[0]) +
        Math.abs(galaxy[1] - otherGalaxy[1]) +
        (expand - 1) * (colCount + rowCount);
    });
    activeGalaxies.add(galaxy);
  });

  return totalDistance;
};

const part1 = (rawInput) => {
  const { rows, cols, galaxies } = parseInput(rawInput);
  return process(galaxies, rows, cols, 2);
};

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
