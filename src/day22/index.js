import run from "aocrunner"

const parseInput = (rawInput) => {
    return rawInput.split("\n").map(line => {
        return line.split('~').map(coord => coord.split(',').map(Number));
    }).sort((a, b) => b[1][2] - a[1][2]);
};


const getState = (blocks) => {
    return blocks.map(b => `${b[0][2]}-${b[1][2]}`).join(',');
};

const fall = (blocks, fallen) => {
    const canFallCache = new Map();

    const canFall = (block, index) => {
        const key = block[0].join(',') + '-' + block[1].join(',');
        if (canFallCache.has(key)) {
            return canFallCache.get(key);
        }

        let z = block[0][2] - 1;
        for (let x = block[0][0]; x <= block[1][0]; x++) {
            for (let y = block[0][1]; y <= block[1][1]; y++) {
                if (blocks.some((o, j) => j !== index && o[0][0] <= x && o[1][0] >= x && o[0][1] <= y && o[1][1] >= y && o[0][2] <= z && o[1][2] >= z)) {
                    canFallCache.set(key, false);
                    return false;
                }
            }
        }
        canFallCache.set(key, true);
        return true;
    };

    blocks.forEach((b, i) => {
        if (b[0][2] <= 1) return true;

        if (canFall(b, i)) {
            b[1][2]--;
            b[0][2]--;
            fallen.add(i);
        }
    });
};

const fallFull = (blocks, fallen) => {
    let changesMade = true;

    while (changesMade) {
        let prevState = blocks.map(b => [...b[0], ...b[1]]).toString();
        fall(blocks, fallen);
        let currentState = blocks.map(b => [...b[0], ...b[1]]).toString();

        changesMade = prevState !== currentState;
    }

    return blocks.map(b => b[1][2]).join(',');
}


const deepCopyBlocks = (blocks) => blocks.map(block => [block[0].slice(), block[1].slice()]);

const process = (rawInput) => {
    const blocks = parseInput(rawInput);
    const fallen = new Set();

    fallFull(blocks, fallen);

    let p1 = 0, p2 = 0;

    blocks.forEach((block, i) => {
        fallen.clear();
        let nblocks = deepCopyBlocks(blocks);
        nblocks.splice(i, 1);

        let beforeFallState = getState(nblocks);
        fallFull(nblocks, fallen);
        let afterFallState = getState(nblocks);

        if (beforeFallState === afterFallState) p1++;
        p2 += fallen.size;
    });

    return {p1, p2};
}

const part1 = (rawInput) => {
    const {p1} = process(rawInput);
    return p1;
}

const part2 = (rawInput) => {
    const {p2} = process(rawInput);
    return p2;
}

run({
    part1: {
        tests: [
            {
                input: `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
                expected: 5,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
                expected: 7,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
