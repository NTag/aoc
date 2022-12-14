import fs from "fs/promises";

const parseInput = (input) => {
  const lines = input.split("\n");
  const grid = [];
  let maxY = 0;
  let minX = Infinity,
    maxX = 0;

  for (const line of lines) {
    const blocks = line.split(" -> ");
    for (let i = 1; i < blocks.length; i += 1) {
      const [px, py] = blocks[i - 1].split(",").map((n) => Number(n));
      const [nx, ny] = blocks[i].split(",").map((n) => Number(n));

      for (let y = Math.min(py, ny); y <= Math.max(py, ny); y += 1) {
        for (let x = Math.min(px, nx); x <= Math.max(px, nx); x += 1) {
          if (grid[y] === undefined) {
            grid[y] = [];
          }
          grid[y][x] = "#";
          maxY = Math.max(maxY, y);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
      }
    }
  }

  return { grid, maxY, minX, maxX };
};

const printGrid = (grid, { maxY, minX, maxX }) => {
  for (let y = 0; y <= maxY; y += 1) {
    let line = "";
    for (let x = minX; x <= maxX; x += 1) {
      line += grid[y]?.[x] || ".";
    }
    console.log(line);
  }
};

const putSand = (grid, x, y, maxY) => {
  if (y > maxY) {
    throw new Error("Out of bounds");
  }

  if (!grid[y + 1]?.[x]) {
    putSand(grid, x, y + 1, maxY);
  } else if (grid[y + 1]?.[x - 1] && grid[y + 1]?.[x + 1]) {
    if (!grid[y]) {
      grid[y] = [];
    }
    grid[y][x] = "o";
    if (y === 0) {
      throw new Error("Limit reached!");
    }
  } else if (!grid[y + 1]?.[x - 1]) {
    putSand(grid, x - 1, y + 1, maxY);
  } else if (!grid[y + 1]?.[x + 1]) {
    putSand(grid, x + 1, y + 1, maxY);
  } else {
    throw new Error("Unhandle case");
  }
};

const addSand = (grid, maxY) => {
  let i = 0;
  while (true) {
    try {
      putSand(grid, 500, 0, maxY);
      i += 1;
    } catch (e) {
      // console.log(e);
      break;
    }
  }
  return i;
};

const part1 = (input) => {
  const { grid, ...boundaries } = parseInput(input);
  printGrid(grid, boundaries);

  const grainsAdded = addSand(grid, boundaries.maxY);

  printGrid(grid, boundaries);

  return grainsAdded;
};

const part2 = (input) => {
  const { grid, ...boundaries } = parseInput(input);
  grid[boundaries.maxY + 2] = new Array(boundaries.maxX * 2).fill("#");

  const { minX, maxX, maxY } = boundaries;
  boundaries.minX -= maxY;
  boundaries.maxX += maxY;
  boundaries.maxY += 2;
  const grainsAdded = addSand(grid, boundaries.maxY) + 1;

  printGrid(grid, boundaries);

  return grainsAdded;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
