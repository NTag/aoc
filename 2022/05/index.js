import fs from "fs/promises";

const part1 = (input) => {
  const stacks = [];
  const lines = input.split("\n");
  for (const line of lines) {
    if (line.startsWith(" 1 ") || !line) {
      continue;
    }

    if (line.startsWith("move")) {
      const values = line.match(/move (\d+) from (\d+) to (\d+)/);
      const [_, cratesCount, from, to] = values;
      const fromStack = stacks[from];
      const toStack = stacks[to];
      for (let i = 0; i < cratesCount; i += 1) {
        const crate = fromStack.pop();
        toStack.push(crate);
      }
    } else {
      const positions = line.match(/.{3,4}/g);
      positions.forEach((crate, i) => {
        const index = i + 1;
        if (!stacks[index]) {
          stacks[index] = [];
        }
        const name = crate.replace(/[^A-Z]/g, "");
        if (name) {
          stacks[index].unshift(name);
        }
      });
    }
  }

  return stacks
    .slice(1)
    .map((stack) => stack[stack.length - 1])
    .join("");
};

const part2 = (input) => {
  const stacks = [];
  const lines = input.split("\n");
  for (const line of lines) {
    if (line.startsWith(" 1 ") || !line) {
      continue;
    }

    if (line.startsWith("move")) {
      const values = line.match(/move (\d+) from (\d+) to (\d+)/);
      const [_, cratesCount, from, to] = values;
      const fromStack = stacks[from];
      const toStack = stacks[to];
      const crates = fromStack.slice(-cratesCount);
      fromStack.splice(-cratesCount, cratesCount);
      toStack.push(...crates);
    } else {
      const positions = line.match(/.{3,4}/g);
      positions.forEach((crate, i) => {
        const index = i + 1;
        if (!stacks[index]) {
          stacks[index] = [];
        }
        const name = crate.replace(/[^A-Z]/g, "");
        if (name) {
          stacks[index].unshift(name);
        }
      });
    }
  }

  return stacks
    .slice(1)
    .map((stack) => stack[stack.length - 1])
    .join("");
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
