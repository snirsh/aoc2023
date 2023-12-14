import run from "aocrunner"


const parseInput = (rawInput) => rawInput.split("\n").map(l => l.split(""))

const rotate = (g) => {
  return g[0].map((_, i) => g.map(row => row[i]).reverse())
}

const calc = data => data[0].map((_, x) => data.reduce((total, row, y) => total + (row[x] === "O" ? data.length - y : 0), 0)).reduce((a, b) => a + b, 0)

const move = g => g[0].forEach((_, x) => { let min = 0; g.forEach((row, y) => { if (row[x] === '#') min = y + 1; else if (row[x] === 'O') [g[y][x], g[min][x]] = ['.', 'O'], min++; }); });

const cycle = g => Array.from({ length: 4 }, () => { move(g); return g = rotate(g); }).pop();

const part1 = (rawInput) => {
  const g = parseInput(rawInput)
  return move(g), calc(g)
}

const part2 = rawInput => {
  let g = parseInput(rawInput);
  move(g);
  const loops = new Map(), bigNumber = 1000000000;
  let r = 1, hash;
  while (r <= bigNumber) {
    g = cycle(g);
    hash = g.map(l => l.join("")).join("\n");
    if (loops.has(hash)) {
      return calc(Array.from({ length: (bigNumber - r) % (r - loops.get(hash)) }, () => g = cycle(g)).pop());
    }
    loops.set(hash, r++);
  }
}

run({
  part1: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})

