import fs from "fs/promises";

const part1 = (input) => {
  const lines = input.split("\n");
  let score = lines.length * 6;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].split(",").map((n) => Number(n));
    for (let j = 0; j < i; j += 1) {
      const lineAdded = lines[j].split(",").map((n) => Number(n));
      const coordsIdenticalCount = line.filter(
        (n, i) => n === lineAdded[i]
      ).length;
      const coordsOneDiffCount = line.filter(
        (n, i) => Math.abs(n - lineAdded[i]) === 1
      ).length;
      if (coordsIdenticalCount === 2 && coordsOneDiffCount === 1) {
        score -= 2;
      }
    }
  }

  return score;
};

const part2 = (input) => {
  const lines = input.split("\n");
  const bounds = lines.reduce(
    (acc, line) => {
      const [x, y, z] = line.split(",").map((n) => Number(n));
      return {
        x: [Math.min(acc.x[0], x - 1), Math.max(acc.x[1], x + 1)],
        y: [Math.min(acc.y[0], y - 1), Math.max(acc.y[1], y + 1)],
        z: [Math.min(acc.z[0], z - 1), Math.max(acc.z[1], z + 1)],
      };
    },
    {
      x: [Infinity, -Infinity],
      y: [Infinity, -Infinity],
      z: [Infinity, -Infinity],
    }
  );
  const cubes = lines.reduce((acc, line) => {
    const [x, y, z] = line.split(",").map((n) => Number(n));
    acc.add(`${x},${y},${z}`);
    return acc;
  }, new Set());

  const toExplore = [[bounds.x[0], bounds.y[0], bounds.z[0]]];
  const explored = new Set();
  const surfaces = new Set();

  while (toExplore.length) {
    const [x, y, z] = toExplore.pop();
    const key = `${x},${y},${z}`;
    if (explored.has(key)) {
      continue;
    }
    explored.add(key);
    const neighbours = [
      [x - 1, y, z],
      [x + 1, y, z],
      [x, y - 1, z],
      [x, y + 1, z],
      [x, y, z - 1],
      [x, y, z + 1],
    ];
    const neighboursInBounds = neighbours.filter(
      ([x, y, z]) =>
        x >= bounds.x[0] &&
        x <= bounds.x[1] &&
        y >= bounds.y[0] &&
        y <= bounds.y[1] &&
        z >= bounds.z[0] &&
        z <= bounds.z[1]
    );
    const freeNeighbours = neighboursInBounds.filter(
      ([x, y, z]) => !cubes.has(`${x},${y},${z}`)
    );
    const takenNeighbours = neighboursInBounds.filter(([x, y, z]) =>
      cubes.has(`${x},${y},${z}`)
    );
    for (const neighbour of takenNeighbours) {
      const keySurface = [
        `${neighbour[0]},${neighbour[1]},${neighbour[2]}`,
        key,
      ].join("-");
      surfaces.add(keySurface);
    }
    toExplore.push(...freeNeighbours);
  }

  return surfaces.size;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
