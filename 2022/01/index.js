import fs from "fs/promises";

const calories = await fs.readFile("calories.txt", "utf-8");

const elves = calories.split("\n\n").map((elf) =>
  elf
    .split("\n")
    .map((line) => parseInt(line, 10))
    .reduce((a, b) => a + b, 0)
);
let total = 0;
for (let i = 0; i < 3; i += 1) {
  const localMax = Math.max(...elves);
  const index = elves.indexOf(localMax);
  total += localMax;
  elves[index] = 0;
}
console.log(total);
