import fs from "fs/promises";

// A & X: pierre (1)
// B & Y: papier (2)
// C & Z: ciseaux (3)

const actions = await fs.readFile("input.txt", "utf-8");
const scores = {
  AX: 3 + 0,
  BX: 1 + 0,
  CX: 2 + 0,
  AY: 1 + 3,
  BY: 2 + 3,
  CY: 3 + 3,
  AZ: 2 + 6,
  BZ: 3 + 6,
  CZ: 1 + 6,
};
const score = actions
  .split("\n")
  .map((line) => {
    const [l1, l2] = line.split(" ");
    return scores[`${l1}${l2}`];
  })
  .reduce((a, b) => a + b, 0);
console.log(score);
