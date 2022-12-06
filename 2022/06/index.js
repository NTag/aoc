import fs from "fs/promises";

const part = (input, size) => {
  for (let i = size; i < input.length; i += 1) {
    const last4 = new Set(input.slice(i - size, i).split(""));
    if (last4.size === size) {
      return i;
    }
  }
};

const part1 = (input) => part(input, 4);
const part2 = (input) => part(input, 14);

const input = (await fs.readFile("input.txt", "utf-8")).trim();
const inputTests = [
  "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
  "bvwbjplbgvbhsrlpgdmjqwftvncz",
  "nppdvjthqldpwncqszvftbrmjlhg",
  "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
  "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
];

const run = () => {
  inputTests.forEach((inputTest, i) => {
    console.log(`part1 - test ${i + 1}: ${part1(inputTest)}`);
  });
  console.log("part1:", part1(input));
  inputTests.forEach((inputTest, i) => {
    console.log(`part2 - test ${i + 1}: ${part2(inputTest)}`);
  });
  console.log("part2:", part2(input));
};

run();
