import run from "aocrunner"

const parseInput = (rawInput, p2=false) => {
  const rows = rawInput.split("\n")
  const sn = rows.map(row => row.split(' '))
  return {
    springs: !p2 ? sn.map(s => s[0]) : sn.map(s => Array(5).fill(s[0]).join('?')),
    nums: !p2 ? sn.map(s => s[1].split(',').map(Number)) : sn.map(s => Array(5).fill(s[1].split(',').map(Number)).flat())
  }
}

const memoizeKey = (dots, blocks, dotPosition, blockPos, blockLen) => {
  return `${dotPosition}_${blockPos}_${blockLen}`;
}

const solve = (dots, blocks, di, bi, blockLen, memo) => {
  if (di === dots.length) {
    return (bi === blocks.length && blockLen === 0) ||
    (bi === blocks.length - 1 && blocks[bi] === blockLen) ? 1 : 0;
  }

  const key = memoizeKey(dots, blocks, di, bi, blockLen);
  if (memo.has(key)) return memo.get(key);

  let res;
  const char = dots[di];

  if (char !== "?" && (char !== "." || char !== "#")) {
    res = calculateNextState(char, dots, blocks, di, bi, blockLen, memo);
  } else {
    res = calculateNextState('.', dots, blocks, di, bi, blockLen, memo) +
      calculateNextState('#', dots, blocks, di, bi, blockLen, memo);
  }

  memo.set(key, res);
  return res;
}

const calculateNextState = (char, dots, blocks, di, bi, blockLen, memo) => {
  if (char === '.' && blockLen === 0) {
    return solve(dots, blocks, di + 1, bi, 0, memo);
  } else if (char === '.' && blockLen > 0 && bi < blocks.length && blocks[bi] === blockLen) {
    return solve(dots, blocks, di + 1, bi + 1, 0, memo);
  } else if (char === '#' && blockLen < (blocks[bi] || 0)) {
    return solve(dots, blocks, di + 1, bi, blockLen + 1, memo);
  }
  return 0;
}

const part1 = (rawInput) => {
  const { springs, nums } = parseInput(rawInput)
  return springs.map((s, i) => solve(s, nums[i], 0, 0, 0, new Map())).reduce((acc, cur) => acc + cur, 0)
}

const part2 = (rawInput) => {
  const { springs, nums } = parseInput(rawInput, true)
  return springs.map((s, i) => solve(s, nums[i], 0, 0, 0, new Map())).reduce((acc, cur) => acc + cur, 0)
}

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
