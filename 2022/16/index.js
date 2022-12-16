import fs from "fs/promises";

// Really not by best day 😂
// It starts getting hard!

const parseInput = (input) => {
  const lines = input.split("\n");
  const valves = {};
  for (const line of lines) {
    const [name, flowRate, _a, _b, _c, tunnels] = line
      .match(
        /Valve ([A-Z]+) has flow rate=([0-9]+); tunnel(s?) lead(s?) to valve(s?) ([A-Z, ]+)/
      )
      .slice(1);
    valves[name] = {
      name,
      flowRate: Number(flowRate),
      tunnels: tunnels.split(", "),
    };
  }
  return valves;
};

const getKey = (position, opened) => {
  return `${position}-${[...opened].sort().join(",")}`;
};

const findBestPath = ({
  valves,
  position,
  duration,
  pressure,
  pressureAccumulated,
  opened,
  mem,
  valvesOpenableCount,
  maxTotal,
}) => {
  if (duration === 0 || opened.size === valvesOpenableCount) {
    const max = pressureAccumulated + pressure * duration;
    if (max > maxTotal.value) {
      maxTotal.value = max;
    }
    return;
  }
  const key = getKey(position, opened);
  const newPressureAccumulated = pressureAccumulated + pressure;
  if (
    mem[duration]?.[key] !== undefined &&
    mem[duration]?.[key] >= newPressureAccumulated
  ) {
    return;
  }

  mem[duration] = mem[duration] || {};
  mem[duration][key] = newPressureAccumulated;

  const valve = valves[position];
  if (valve.flowRate > 0 && !opened.has(position)) {
    const newOpened = new Set(opened);
    newOpened.add(position);
    findBestPath({
      valves,
      position,
      duration: duration - 1,
      pressure: pressure + valve.flowRate,
      pressureAccumulated: newPressureAccumulated,
      opened: newOpened,
      mem,
      valvesOpenableCount,
      maxTotal,
    });
  }
  for (const tunnel of valve.tunnels) {
    findBestPath({
      valves,
      position: tunnel,
      duration: duration - 1,
      pressure,
      pressureAccumulated: newPressureAccumulated,
      opened,
      mem,
      valvesOpenableCount,
      maxTotal,
    });
  }
};

const part1 = (input, y) => {
  const valves = parseInput(input);
  const start = "AA";
  const duration = 30;
  const mem = [];
  const valvesOpenableCount = Object.values(valves).filter(
    ({ flowRate }) => flowRate > 0
  ).length;
  const maxTotal = { value: 0 };
  findBestPath({
    valves,
    position: start,
    duration,
    pressure: 0,
    pressureAccumulated: 0,
    opened: new Set(),
    mem,
    valvesOpenableCount,
    maxTotal,
  });
  return maxTotal.value;
};

const getKey2 = (positionA, positionB, opened) => {
  return `${[positionA, positionB].sort().join(",")}-${[...opened]
    .sort()
    .join(",")}`;
};

const getShortKey = (positionA, positionB, opened) => {
  return `${[...opened].sort().join(",")}`;
};

let bestDurationForKey = {};

const findBestPath2 = ({
  valves,
  positionA,
  positionB,
  duration,
  pressure,
  pressureAccumulated,
  opened,
  mem,
  valvesOpenableCount,
  maxTotal,
  maximumPressure,
}) => {
  const maxPossible = pressureAccumulated + duration * maximumPressure;
  if (maxPossible < maxTotal.value) {
    return;
  }

  if (duration === 0 || opened.size === valvesOpenableCount) {
    const max = pressureAccumulated + pressure * duration;
    if (max > maxTotal.value) {
      maxTotal.value = max;
    }
    return;
  }

  const key = getKey2(positionA, positionB, opened);
  const shortKey = getShortKey(positionA, positionB, opened);
  const newPressureAccumulated = pressureAccumulated + pressure;
  if (
    mem[duration]?.[key] !== undefined &&
    mem[duration]?.[key] >= newPressureAccumulated
  ) {
    return;
  }
  if (
    bestDurationForKey[shortKey] !== undefined &&
    bestDurationForKey[shortKey] > duration
  ) {
    return;
  }
  bestDurationForKey[key] = duration;

  mem[duration] = mem[duration] || {};
  mem[duration][key] = newPressureAccumulated;

  const valveA = valves[positionA];
  const valveB = valves[positionB];
  if (valveA !== valveB && valveB.flowRate > 0 && !opened.has(positionB)) {
    const newOpened = new Set(opened);
    newOpened.add(positionB);
    if (valveA.flowRate > 0 && !opened.has(positionA)) {
      const newOpened2 = new Set(newOpened);
      newOpened2.add(positionA);
      findBestPath2({
        valves,
        positionA,
        positionB,
        duration: duration - 1,
        pressure: pressure + valveA.flowRate + valveB.flowRate,
        pressureAccumulated: newPressureAccumulated,
        opened: newOpened2,
        mem,
        valvesOpenableCount,
        maxTotal,
        maximumPressure,
      });
    }

    for (const tunnelA of valveA.tunnels) {
      findBestPath2({
        valves,
        positionA: tunnelA,
        positionB,
        duration: duration - 1,
        pressure: pressure + valveB.flowRate,
        pressureAccumulated: newPressureAccumulated,
        opened: newOpened,
        mem,
        valvesOpenableCount,
        maxTotal,
        maximumPressure,
      });
    }
  }

  if (valveA.flowRate > 0 && !opened.has(positionA)) {
    const newOpened = new Set(opened);
    newOpened.add(positionA);
    for (const tunnelB of valveB.tunnels) {
      findBestPath2({
        valves,
        positionA,
        positionB: tunnelB,
        duration: duration - 1,
        pressure: pressure + valveA.flowRate,
        pressureAccumulated: newPressureAccumulated,
        opened: newOpened,
        mem,
        valvesOpenableCount,
        maxTotal,
        maximumPressure,
      });
    }
  }

  for (const tunnelA of valveA.tunnels) {
    for (const tunnelB of valveB.tunnels) {
      findBestPath2({
        valves,
        positionA: tunnelA,
        positionB: tunnelB,
        duration: duration - 1,
        pressure,
        pressureAccumulated: newPressureAccumulated,
        opened,
        mem,
        valvesOpenableCount,
        maxTotal,
        maximumPressure,
      });
    }
  }
};

const part2 = (input) => {
  const valves = parseInput(input);
  const start = "AA";
  const duration = 26;
  const mem = [];
  const valvesOpenableCount = Object.values(valves).filter(
    ({ flowRate }) => flowRate > 0
  ).length;
  const maximumPressure = Object.values(valves).reduce(
    (acc, { flowRate }) => acc + flowRate,
    0
  );
  bestDurationForKey = {};
  const maxTotal = { value: 0 };
  findBestPath2({
    valves,
    positionA: start,
    positionB: start,
    duration,
    pressure: 0,
    pressureAccumulated: 0,
    opened: new Set(),
    mem,
    valvesOpenableCount,
    maxTotal,
    maximumPressure,
  });
  return maxTotal.value;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
