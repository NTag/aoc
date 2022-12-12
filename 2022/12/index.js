import fs from "fs/promises";

const parseGrid = (input) => {
  let departure, arrival;
  const grid = input.split("\n").map((line, y) =>
    line.split("").map((char, x) => {
      if (char === "S") {
        departure = [x, y];
        return 0;
      } else if (char === "E") {
        arrival = [x, y];
        return 25;
      }

      return char.charCodeAt(0) - 97;
    })
  );

  return {
    grid,
    departure,
    arrival,
    width: grid[0].length,
    height: grid.length,
  };
};

const part1 = (input) => {
  const { grid, departure, arrival, width, height } = parseGrid(input);

  const getPosKey = ([x, y]) => `${x},${y}`;
  const shortestLengths = { [getPosKey(departure)]: 0 };

  const findSortestLength = (position) => {
    const [x, y] = position;
    const currentLength = shortestLengths[getPosKey(position)];

    const nextPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(([nx, ny]) => {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
        return false;
      }

      if (grid[ny][nx] > grid[y][x] + 1) {
        return false;
      }

      const nextPositionExistingLength =
        shortestLengths[getPosKey([nx, ny])] || Infinity;

      return currentLength + 1 < nextPositionExistingLength;
    });

    for (const nextPosition of nextPositions) {
      shortestLengths[getPosKey(nextPosition)] = Math.min(
        currentLength + 1,
        shortestLengths[getPosKey(nextPosition)] || Infinity
      );
      findSortestLength(nextPosition);
    }
  };

  findSortestLength(departure);

  return shortestLengths[getPosKey(arrival)];
};

const part2 = (input) => {
  const { grid, departure, arrival, width, height } = parseGrid(input);

  const getPosKey = ([x, y]) => `${x},${y}`;
  const shortestLengths = { [getPosKey(departure)]: 0 };

  const findSortestLength = (position) => {
    const [x, y] = position;
    const currentLength = shortestLengths[getPosKey(position)];

    const nextPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(([nx, ny]) => {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
        return false;
      }

      if (grid[ny][nx] > grid[y][x] + 1) {
        return false;
      }

      const nextPositionExistingLength =
        shortestLengths[getPosKey([nx, ny])] || Infinity;
      return currentLength + 1 < nextPositionExistingLength;
    });

    for (const nextPosition of nextPositions) {
      shortestLengths[getPosKey(nextPosition)] = Math.min(
        currentLength + 1,
        shortestLengths[getPosKey(nextPosition)] || Infinity
      );
      findSortestLength(nextPosition);
    }
  };

  const departures = grid
    .map((line, y) => line.map((z, x) => ({ z, pos: [x, y] })))
    .flat()
    .filter(({ z }) => z === 0)
    .map(({ pos }) => pos);

  for (const dep of departures) {
    shortestLengths[getPosKey(dep)] = 0;
    findSortestLength(dep);
  }

  return shortestLengths[getPosKey(arrival)];
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
