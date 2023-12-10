import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split("\n")

const treeNode = (value, children) => ({ value, children })
const coordinates = {
  N: (r, c) => [r - 1, c],
  S: (r, c) => [r + 1, c],
  E: (r, c) => [r, c + 1],
  W: (r, c) => [r, c - 1],
};

const findChildrenForChar = (matrix, char, r, c) => {
  const cell = matrix[r][c];
  const validCoords = (coords) =>
    coords.filter(([nr, nc]) => nr >= 0 && nc >= 0 && nr < matrix.length && nc < matrix[0].length);

  if (cell === ".") {
    return validCoords(Object.values(coordinates).map(coord => coord(r, c))).filter(([nr, nc]) => matrix[nr][nc] === ".");
  }

  const directionMap = {
    "F": ["E", "S"],
    "J": ["N", "W"],
    "|": ["N", "S"],
    "L": ["N", "E"],
    "-": ["W", "E"],
    "7": ["W", "S"],
    "S": ["N", "W", "E", "S"],
  };

  return directionMap[cell] ?
    validCoords(directionMap[cell].map(dir => coordinates[dir](r, c))).filter(([nr, nc]) => matrix[nr][nc] !== ".") :
    [];
};


function findLoopPositions(input) {
  const startingPoint = input.map((r, i) => [i, r.indexOf("S")]).find((r) => r[1] > -1)
  const rootNode = treeNode(startingPoint, [])
  const stack = [rootNode]
  const visited = new Set()
  visited.add(startingPoint.toString())
  while (stack.length > 0) {
    const node = stack.pop()
    const [r, c] = node.value
    const children = findChildrenForChar(input, input[r][c], r, c)
    for (const child of children) {
      if (visited.has(child.toString())) {
        continue
      }
      visited.add(child.toString())
      node.children.push(treeNode(child, []))
      stack.push(node.children[node.children.length - 1])
    }
  }
  return visited
}

const det = (a, b) => {
  return (a[0] * b[1]) - (a[1] * b[0])
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const visited = findLoopPositions(input)
  return visited.size / 2
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const visited = findLoopPositions(input)
  const points = [...visited].map(coord => {
    const [r, c] = coord.split(",").map(Number)
    return [r, c]
  })
  let area = 0
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]
    const p2 = points[(i + 1) % points.length]
    const d = det(p1, p2)
    area += (0.5 * d)
  }
  return Math.round(Math.abs(area) - Math.round(visited.size*0.5) + 1)
}

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 1,
      },
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`,
        expected: 4,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
