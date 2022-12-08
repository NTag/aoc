import fs from "fs/promises";

const part1 = (input) => {
  const visibleTrees = new Set();

  const lines = input.split("\n");
  const trees = [];
  lines.forEach((line, y) => {
    const row = [];
    line.split("").forEach((char) => {
      row.push(parseInt(char, 10));
    });
    trees.push(row);
  });

  const height = trees.length;
  const width = trees[0].length;

  const numberOfTrees = height * width;

  // Top to bottom
  for (let x = 0; x < width; x += 1) {
    let highestTree = -1;
    for (let y = 0; y < height; y += 1) {
      const tree = trees[y][x];
      if (tree > highestTree) {
        highestTree = tree;
        visibleTrees.add(`${x},${y}`);
      }
    }
  }

  // Bottom to top
  for (let x = 0; x < width; x += 1) {
    let highestTree = -1;
    for (let y = height - 1; y >= 0; y -= 1) {
      const tree = trees[y][x];
      if (tree > highestTree) {
        highestTree = tree;
        visibleTrees.add(`${x},${y}`);
      }
    }
  }

  // Left to right
  for (let y = 0; y < height; y += 1) {
    let highestTree = -1;
    for (let x = 0; x < width; x += 1) {
      const tree = trees[y][x];
      if (tree > highestTree) {
        highestTree = tree;
        visibleTrees.add(`${x},${y}`);
      }
    }
  }

  // Right to left
  for (let y = 0; y < height; y += 1) {
    let highestTree = -1;
    for (let x = width - 1; x >= 0; x -= 1) {
      const tree = trees[y][x];
      if (tree > highestTree) {
        highestTree = tree;
        visibleTrees.add(`${x},${y}`);
      }
    }
  }

  return visibleTrees.size;
};

const part2 = (input) => {
  const lines = input.split("\n");
  const trees = [];
  lines.forEach((line, y) => {
    const row = [];
    line.split("").forEach((char) => {
      row.push(parseInt(char, 10));
    });
    trees.push(row);
  });

  const height = trees.length;
  const width = trees[0].length;

  let bestScore = 0;

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const tree = trees[y][x];

      let visibleTreesOnRight = 0;
      for (let i = x + 1; i < width; i += 1) {
        const otherTree = trees[y][i];
        visibleTreesOnRight += 1;
        if (otherTree >= tree) {
          break;
        }
      }

      let visibleTreesOnLeft = 0;
      for (let i = x - 1; i >= 0; i -= 1) {
        const otherTree = trees[y][i];
        visibleTreesOnLeft += 1;
        if (otherTree >= tree) {
          break;
        }
      }

      let visibleTreesOnTop = 0;
      for (let i = y - 1; i >= 0; i -= 1) {
        const otherTree = trees[i][x];
        visibleTreesOnTop += 1;
        if (otherTree >= tree) {
          break;
        }
      }

      let visibleTreesOnBottom = 0;
      for (let i = y + 1; i < height; i += 1) {
        const otherTree = trees[i][x];
        visibleTreesOnBottom += 1;
        if (otherTree >= tree) {
          break;
        }
      }

      const score =
        visibleTreesOnRight *
        visibleTreesOnLeft *
        visibleTreesOnTop *
        visibleTreesOnBottom;

      if (score > bestScore) {
        bestScore = score;
      }
    }
  }

  return bestScore;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `30373
25512
65332
33549
35390`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
