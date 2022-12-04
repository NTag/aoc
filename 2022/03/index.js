import fs from "fs/promises";

const bags = (await fs.readFile("input.txt", "utf-8")).split("\n");

const getCode = (l) => {
  const code = l.charCodeAt(0);

  if (code >= 97) {
    return code - 96;
  }
  return code - 38;
};

const part1 = () => {
  const score = bags
    .map((bag) => {
      const items1String = bag.slice(0, bag.length / 2);
      const items2String = bag.slice(bag.length / 2);
      const items1 = new Set(items1String.split(""));
      const commonItem = items2String
        .split("")
        .find((item) => items1.has(item));
      return getCode(commonItem);
    })
    .reduce((a, b) => a + b, 0);
  console.log(score);
};

const part2 = () => {
  const groupsCount = bags.length / 3;
  let score = 0;
  for (let i = 0; i < groupsCount; i += 1) {
    const groupBags = bags.slice(i * 3, i * 3 + 3);
    const badge = groupBags[0]
      .split("")
      .find((l) => groupBags[1].includes(l) && groupBags[2].includes(l));
    score += getCode(badge);
  }
  console.log(score);
};

part1();
part2();
