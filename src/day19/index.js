import run from "aocrunner"

const parseInput = (rawInput) => {
  return rawInput.split("\n\n").map((matrix, index) => {
    const rows = matrix.split('\n');
    return index === 0 ? rows.map(rowToWorkFlow) : rows.map(rowToRating);
  });
};

const rowToWorkFlow = (row) => {
  const [name, paramPart] = row.split("{").map(part => part.trim());
  const params = paramPart.split("}")[0].split(",");

  const conditions = params.map(param => {
    const [condition, whereToSend] = param.split(":").map(part => part.trim());
    return { condition, whereToSend };
  });

  return { [name.trim()]: { workflow: conditions } };
};

const rowToRating = (row) => {
  const ratings = row.split("{")[1].split("}")[0].split(",").map(param => {
    const [name, value] = param.split("=").map(part => part.trim());
    return { [name]: Number(value) };
  });

  return ratings.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

const parseConditionToFunction = (condition, part = false) => {
  const conditionRegex = /([xmas]+)([<>=]+)([0-9]+)/;
  const match = condition.match(conditionRegex);

  if (!match) return part ? condition : () => condition;

  const [, param, operator, value] = match;
  if (part) return { param, operator, value: Number(value) };

  return (input) => {
    switch (operator) {
      case "<": return input[param] < value;
      case ">": return input[param] > value;
      case "=": return input[param] === value;
      default: return false;
    }
  };
};

const part1 = (rawInput) => {
  const [wfa, ratings] = parseInput(rawInput);
  const acceptedParts = [];
  const wf = wfa.reduce((acc, curr) => ({ ...acc, ...curr }), {});

  for (const rating of ratings) {
    let name = 'in';
    while (name !== 'R' && name !== 'A') {
      for (const { condition, whereToSend } of wf[name].workflow) {
        const result = parseConditionToFunction(condition)(rating);
        if (typeof result === 'string') {
          name = result;
          break;
        } else if (result) {
          name = whereToSend;
          break;
        }
      }
    }
    if (name === 'A') {
      acceptedParts.push(rating);
    }
  }

  return acceptedParts.reduce((acc, curr) => acc + curr.x + curr.m + curr.a + curr.s, 0);
};

const process = (wf, c = 'in', vars) => {
  if (c === 'R') return 0;
  if (c === 'A') return Object.values(vars).reduce((acc, curr) => acc * (curr[1] - curr[0] + 1), 1);

  const { workflow } = wf[c];
  let total = 0;
  const lastCondition = workflow[workflow.length - 1];
  const conditions = workflow.slice(0, -1);

  for (const { condition, whereToSend } of conditions) {
    const { param, operator, value } = parseConditionToFunction(condition, true);
    const [min, max] = vars[param];

    if (operator === '<') {
      if (min < value) {
        total += process(wf, whereToSend, { ...vars, [param]: [min, value - 1] });
      }
      vars[param] = max >= value ? [value, max] : [min, max];
    } else {
      if (max > value) {
        total += process(wf, whereToSend, { ...vars, [param]: [value + 1, max] });
      }
      vars[param] = min <= value ? [min, value] : [min, max];
    }
  }

  total += process(wf, lastCondition.condition, vars);
  return total;
};

const part2 = (rawInput) => {
  const [wfa, ratings] = parseInput(rawInput);
  const wf = wfa.reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const getInitialRange = () => ([1, 4000]);
  const xmasRanges = Object.keys(ratings[0]).reduce((acc, curr) => ({ ...acc, [curr]: getInitialRange() }), {});

  return process(wf, 'in', xmasRanges);
};

run({
  part1: {
    tests: [
      {
        input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `in{x<1000:aaa,bbb}
aaa{m<1000:A,R}
bbb{m>2000:A,R}

{x=500,m=500}`,
        expected: 7000001,
      },
      {
        input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
