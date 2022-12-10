import fs from "fs/promises";

const part1 = (input) => {
  const instructions = input.split("\n");

  const cycles = [20, 60, 100, 140, 180, 220];
  let strenght = 0;

  let X = 1;
  let cycle = 1;

  for (const instruction of instructions) {
    const [action, value] = instruction.split(" ");
    if (cycles.includes(cycle)) {
      strenght += X * cycle;
    }
    if (action === "addx") {
      if (cycles.includes(cycle + 1)) {
        strenght += X * (cycle + 1);
      }
      cycle += 2;
      X += Number(value);
    } else if (action === "noop") {
      cycle += 1;
    }
  }

  return strenght;
};

const part2 = (input) => {
  const instructions = input.split("\n");

  let X = 1;

  const positions = [1];
  for (const instruction of instructions) {
    const [action, value] = instruction.split(" ");
    if (action === "addx") {
      positions.push(X);
      X += Number(value);
      positions.push(X);
    } else if (action === "noop") {
      positions.push(X);
    }
  }

  const pixels = positions
    .map((x, i) => {
      if (i % 40 >= x - 1 && i % 40 <= x + 1) {
        return "#";
      }
      return ".";
    })
    .join("");

  const image = pixels.match(/.{40}/g).join("\n");

  return image;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const outputTest2 = `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:");
  console.log(part2(inputTest));
  if (part2(inputTest) === outputTest2) {
    console.log("part2 - test: OK");
  } else {
    console.log("part2 - test: FAIL");
  }
  console.log("");
  console.log("part2");
  console.log(part2(input));
};

run();
