import fs from "fs/promises";

// 1: right order
// 0: can't decide
// -1: wrong order
const comparePairs = (a, b) => {
  if (typeof a === "number" && typeof b === "number") {
    if (a === b) {
      return 0;
    } else if (a < b) {
      return 1;
    } else {
      return -1;
    }
  } else if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < a.length; i += 1) {
      const ai = a[i];
      const bi = b[i];
      if (bi === undefined) {
        return -1;
      }
      const result = comparePairs(ai, bi);
      if (result !== 0) {
        return result;
      }
    }
    return 1;
  } else if (Array.isArray(a)) {
    return comparePairs(a, [b]);
  } else if (Array.isArray(b)) {
    return comparePairs([a], b);
  } else {
    throw new Error("Invalid input");
  }
};

const parsePairs = (input) => {
  const pairs = input
    .split("\n\n")
    .map((pair) => pair.split("\n").map((line) => JSON.parse(line)));

  return pairs;
};

const part1 = (input) => {
  const pairs = parsePairs(input);

  const indexesRightOrder = [];
  for (const pair of pairs) {
    const [a, b] = pair;
    if (comparePairs(a, b) === 1) {
      indexesRightOrder.push(pairs.indexOf(pair));
    }
  }

  const sumOfIndexes = indexesRightOrder.reduce(
    (sum, index) => sum + index + 1,
    0
  );
  return sumOfIndexes;
};

const part2 = (input) => {
  const pairs = parsePairs(input + `\n\n[[2]]\n[[6]]`)
    .flat()
    .filter((x) => !!x);

  const sortedPairs = pairs.sort((a, b) => -1 * comparePairs(a, b));

  const index2 =
    sortedPairs.findIndex(
      (x) => x.length === 1 && x[0].length === 1 && x[0][0] === 2
    ) + 1;
  const index6 =
    sortedPairs.findIndex(
      (x) => x.length === 1 && x[0].length === 1 && x[0][0] === 6
    ) + 1;

  return index2 * index6;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
