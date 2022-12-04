import fs from "fs/promises";

const part1 = (input) => {
  const pairs = input.split("\n");
  let count = 0;
  for (const pair of pairs) {
    const [range1, range2] = pair.split(",");
    const [r1n1, r1n2] = range1.split("-").map((n) => parseInt(n, 10));
    const [r2n1, r2n2] = range2.split("-").map((n) => parseInt(n, 10));
    if ((r1n1 <= r2n1 && r2n2 <= r1n2) || (r2n1 <= r1n1 && r1n2 <= r2n2)) {
      count += 1;
    }
  }
  return count;
};

const part2 = (input) => {
  const pairs = input.split("\n");
  let count = 0;
  for (const pair of pairs) {
    const [range1, range2] = pair.split(",");
    const [r1n1, r1n2] = range1.split("-").map((n) => parseInt(n, 10));
    const [r2n1, r2n2] = range2.split("-").map((n) => parseInt(n, 10));
    const isNotOverlapping = r1n2 < r2n1 || r2n2 < r1n1;
    if (!isNotOverlapping) {
      count += 1;
    }
  }
  return count;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
