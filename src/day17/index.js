import run from "aocrunner"
import { isValidPosition, PriorityQueue } from "../utils/index.js"

const parseInput = (rawInput) => rawInput.split("\n").map(l => l.split("")).map(l => l.map(Number))

const process = (grid, part = false) => {
  const queue = new PriorityQueue((a, b) => b[0] - a[0]);
  queue.push([0, 0, 0, 0, 0, 0]);

  const seen = new Set();

  while (queue.length > 0) {
    const [hl, r, c, dr, dc, n] = queue.pop();

    if (r === grid.length - 1 && c === grid[0].length - 1 && (!part || n >= 4)) {
      return hl;
    }

    const key = JSON.stringify([r, c, dr, dc, n]);
    if (seen.has(key)) continue;
    seen.add(key);

    if (n < (part ? 10 : 3) && (dr !== 0 || dc !== 0)) {
      const nr = r + dr;
      const nc = c + dc;
      if (isValidPosition(nr, nc, grid)) {
        queue.push([hl + grid[nr][nc], nr, nc, dr, dc, n + 1]);
      }
    }

    if (!part || (n >= 4 || (dr === 0 && dc === 0))) {
      for (const [ndr, ndc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        if ((ndr !== dr || ndc !== dc) && (ndr !== -dr || ndc !== -dc)) {
          const nr = r + ndr;
          const nc = c + ndc;
          if (isValidPosition(nr, nc, grid)) {
            queue.push([hl + grid[nr][nc], nr, nc, ndr, ndc, 1]);
          }
        }
      }
    }
  }

  return 0;
};



const part1 = (rawInput) => {
  const nodes = parseInput(rawInput)

  return process(nodes)
}

const part2 = (rawInput) => {
  const matrix = parseInput(rawInput)

  return process(matrix, true)
}

run({
  part1: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 94,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
