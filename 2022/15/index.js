import fs from "fs/promises";

const parseInput = (input) => {
  const lines = input.split("\n");
  const sensors = lines.map((line) => {
    const [sensor, beacon] = line.split(":");
    const [sx, sy] = sensor
      .match(/x=([0-9-]+), y=([0-9-]+)/)
      .slice(1)
      .map((n) => Number(n));
    const [bx, by] = beacon
      .match(/x=([0-9-]+), y=([0-9-]+)/)
      .slice(1)
      .map((n) => Number(n));

    const distance = Math.abs(sx - bx) + Math.abs(sy - by);
    return { sx, sy, bx, by, distance };
  });

  return sensors;
};

const mergeIntervals = (intervals) => {
  const sortedIntervals = intervals.sort((a, b) => a[0] - b[0]);
  const mergedIntervals = [];
  let currentInterval = sortedIntervals[0];
  for (let i = 1; i < sortedIntervals.length; i += 1) {
    const nextInterval = sortedIntervals[i];
    if (currentInterval[1] >= nextInterval[0] - 1) {
      currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
    } else {
      mergedIntervals.push(currentInterval);
      currentInterval = nextInterval;
    }
  }
  mergedIntervals.push(currentInterval);
  return mergedIntervals;
};

const getSizeOfIntervals = (intervals) => {
  return intervals.reduce((acc, [start, end]) => acc + end - start, 0);
};

const getIntervalsAtRow = (sensors, y) => {
  const intervals = [];

  for (const sensor of sensors) {
    const { sx, sy, distance } = sensor;
    const distanceToY = Math.abs(sy - y);
    const distanceRemaining = distance - distanceToY;
    if (distanceRemaining >= 0) {
      intervals.push([sx - distanceRemaining, sx + distanceRemaining]);
    }
  }

  return mergeIntervals(intervals);
};

const part1 = (input, y) => {
  const sensors = parseInput(input);

  const intervals = getIntervalsAtRow(sensors, y);

  return getSizeOfIntervals(intervals);
};

const part2 = (input, max) => {
  const sensors = parseInput(input);

  for (let y = max; y >= 0; y -= 1) {
    const intervals = getIntervalsAtRow(sensors, y);
    const validIntervals = intervals.filter(
      ([start, end]) => start <= max && end >= 0
    );
    if (validIntervals.length > 1) {
      const x = validIntervals[0][1] + 1;

      return x * 4000000 + y;
    }
  }
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const run = () => {
  console.log("part1 - test:", part1(inputTest, 10));
  console.log("part1:", part1(input, 2000000));
  console.log("part2 - test:", part2(inputTest, 20));
  console.log("part2:", part2(input, 4000000));
};

run();
