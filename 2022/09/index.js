import fs from "fs/promises";

const getPositionsFromMoves = (input) => {
  let position = [0, 0];
  const positions = [[0, 0]];
  const lines = input.split("\n");

  for (const line of lines) {
    const [direction, countString] = line.split(" ");
    const count = parseInt(countString, 10);
    for (let i = 0; i < count; i += 1) {
      switch (direction) {
        case "R":
          position[0] += 1;
          break;
        case "L":
          position[0] -= 1;
          break;
        case "U":
          position[1] += 1;
          break;
        case "D":
          position[1] -= 1;
          break;
      }

      positions.push([...position]);
    }
  }

  return positions;
};

const getTailPositions = (positionsHead) => {
  let positionTail = [0, 0];
  const visited = new Set();
  const positionsTail = [[0, 0]];
  visited.add("0,0");

  for (const positionHead of positionsHead) {
    if (
      Math.abs(positionHead[0] - positionTail[0]) > 1 ||
      Math.abs(positionHead[1] - positionTail[1]) > 1
    ) {
      positionTail[0] += Math.round((positionHead[0] - positionTail[0]) / 1.5);
      positionTail[1] += Math.round((positionHead[1] - positionTail[1]) / 1.5);
    }

    visited.add(`${positionTail[0]},${positionTail[1]}`);
    positionsTail.push([...positionTail]);
  }

  return { visitedCount: visited.size, positionsTail };
};

const part1 = (input) => {
  const positionsHead = getPositionsFromMoves(input);
  const { visitedCount } = getTailPositions(positionsHead);

  return visitedCount;
};

const part2 = (input) => {
  let positionsHead = getPositionsFromMoves(input);
  let count = 0;
  for (let i = 0; i < 9; i += 1) {
    const { visitedCount, positionsTail } = getTailPositions(positionsHead);
    count = visitedCount;

    positionsHead = positionsTail;
  }

  return count;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
const inputTest2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest2));
  console.log("part2:", part2(input));
};

run();
