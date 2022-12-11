import fs from "fs/promises";

const readProgram = (input) => {
  const parts = input.split("\n\n");

  // { items: [79, 98], operation: (score) => score * 19, test: (score) => score % 23 === 0, ifTrue: 2, ifFalse: 3 }
  const monkeys = [];

  for (const part of parts) {
    const [_, startingItems, operationString, test, ifTrue, ifFalse] = part
      .split("\n")
      .map((line) => line.trim());

    const items = startingItems
      .split(":")[1]
      .split(",")
      .map((item) => Number(item.trim()));

    const operationFn = (score) => {
      const operation = operationString.split(": ")[1];
      const value = operation.split(" ")[operation.split(" ").length - 1];
      if (operation === "new = old * old") {
        return score * score;
      } else if (operation.startsWith("new = old *")) {
        return score * Number(value);
      } else if (operation.startsWith("new = old +")) {
        return score + Number(value);
      }
    };

    const testFn = (score) => {
      const values = test.split(" ");
      const value = values[values.length - 1];
      return score % Number(value) === 0;
    };

    const ifTrueId = Number(ifTrue.split(" ")[ifTrue.split(" ").length - 1]);
    const ifFalseId = Number(ifFalse.split(" ")[ifFalse.split(" ").length - 1]);

    monkeys.push({
      items,
      operation: operationFn,
      test: testFn,
      ifTrue: ifTrueId,
      ifFalse: ifFalseId,
      itemsInspected: 0,
    });
  }

  return monkeys;
};

const part1 = (input) => {
  const monkeys = readProgram(input);

  for (let round = 1; round <= 20; round += 1) {
    for (const monkey of monkeys) {
      const items = monkey.items;
      for (const item of items) {
        const newItem = Math.floor(monkey.operation(item) / 3);
        if (monkey.test(newItem)) {
          monkeys[monkey.ifTrue].items.push(newItem);
        } else {
          monkeys[monkey.ifFalse].items.push(newItem);
        }
      }
      monkey.items = [];
      monkey.itemsInspected += items.length;
    }
  }

  const scores = monkeys.map((monkey) => monkey.itemsInspected);
  const maxScore = Math.max(...scores);
  const maxScoreIndex = scores.indexOf(maxScore);
  scores.splice(maxScoreIndex, 1);
  const maxScore2 = Math.max(...scores);

  return maxScore * maxScore2;
};

const part2 = (input, divider) => {
  const monkeys = readProgram(input);

  for (let round = 1; round <= 10_000; round += 1) {
    for (const monkey of monkeys) {
      const items = monkey.items;
      for (const item of items) {
        const newItem = monkey.operation(item) % divider;
        if (monkey.test(newItem)) {
          monkeys[monkey.ifTrue].items.push(newItem);
        } else {
          monkeys[monkey.ifFalse].items.push(newItem);
        }
      }
      monkey.items = [];
      monkey.itemsInspected += items.length;
    }
  }

  const scores = monkeys.map((monkey) => monkey.itemsInspected);
  const maxScore = Math.max(...scores);
  const maxScoreIndex = scores.indexOf(maxScore);
  scores.splice(maxScoreIndex, 1);
  const maxScore2 = Math.max(...scores);

  return maxScore * maxScore2;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest, 23 * 19 * 13 * 17));
  console.log("part2:", part2(input, 11 * 2 * 5 * 7 * 17 * 19 * 3 * 13));
};

run();
