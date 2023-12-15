import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split("\n").map(l => l.split(","))[0]

const myHash = (str) => {
  return str.split('').reduce((acc, char) => ((acc + char.charCodeAt(0))*17)%256,0)
}

const part1 = (rawInput) => {
  const rows = parseInput(rawInput)
  return rows.reduce((a,r) => a+myHash(r), 0)
}

const part2 = (rawInput) => {
  const rows = parseInput(rawInput)
  const boxes = Array(256).fill(0).reduce((acc, _, i) => {
    acc[i] = []
    return acc
  }, {})
  for (const op of rows) {
    const operation = op.match(/[=|\-]/g)[0]
    const [label, focalLength] = op.split(operation).map((c,i) => i === 0 ? c : parseInt(c) )
    const boxNumber = myHash(label)
    const lens = {label, focalLength, boxNumber, operation}
    const index = boxes[boxNumber].findIndex(b => b.label === label)
    if (operation === '=') {
      index === -1 ? boxes[boxNumber].push(lens) : boxes[boxNumber][index] = lens
    } else if (index !== -1){
      boxes[boxNumber].splice(index, 1)
    }
  }
  const nonEmptyBoxes = Object.values(boxes).filter(b => b.length)
  return nonEmptyBoxes.map(b=>b.map((l,i)=>(l.boxNumber+1)*(i+1)*(l.focalLength))).flat().reduce((a,b)=>a+b,0)
}

run({
  part1: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
