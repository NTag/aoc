import fs from "fs/promises";

const part1 = (input) => {
  const root = { children: {}, totalSize: 0 };
  let current = root;

  const dirsBelow100_000 = new Set();

  const addSizeToFolder = (folder, size) => {
    folder.totalSize += size;

    if (folder.totalSize <= 100_000) {
      dirsBelow100_000.add(folder);
    } else {
      dirsBelow100_000.delete(folder);
    }

    if (folder.parent) {
      addSizeToFolder(folder.parent, size);
    }
  };

  const commands = input.split("$").slice(1);
  for (const command of commands) {
    const lines = command.trim().split("\n");
    const [cmd, ...results] = lines;
    if (cmd.startsWith("cd")) {
      const [_, dir] = cmd.match(/cd (.+)/);
      if (dir === "..") {
        current = current.parent;
      } else if (dir === "/") {
        current = root;
      } else {
        current = current.children[dir];
      }
    } else if (cmd === "ls") {
      const dirs = results
        .map((line) => line.match(/dir (.+)/))
        .filter(Boolean)
        .map((match) => match[1]);
      dirs.forEach((dir) => {
        current.children[dir] = { children: {}, parent: current, totalSize: 0 };
      });
      if (current.totalSize === 0) {
        const totalSize = results
          .map((line) => line.match(/(\d+) .+/))
          .filter(Boolean)
          .map((match) => parseInt(match[1], 10))
          .reduce((acc, size) => acc + size, 0);
        addSizeToFolder(current, totalSize);
      }
    }
  }

  return [...dirsBelow100_000].reduce(
    (size, folder) => size + folder.totalSize,
    0
  );
};

const part2 = (input) => {
  const root = { children: {}, totalSize: 0 };
  let current = root;

  const directories = new Set();

  const addSizeToFolder = (folder, size) => {
    folder.totalSize += size;

    directories.add(folder);

    if (folder.parent) {
      addSizeToFolder(folder.parent, size);
    }
  };

  const commands = input.split("$").slice(1);
  for (const command of commands) {
    const lines = command.trim().split("\n");
    const [cmd, ...results] = lines;
    if (cmd.startsWith("cd")) {
      const [_, dir] = cmd.match(/cd (.+)/);
      if (dir === "..") {
        current = current.parent;
      } else if (dir === "/") {
        current = root;
      } else {
        current = current.children[dir];
      }
    } else if (cmd === "ls") {
      const dirs = results
        .map((line) => line.match(/dir (.+)/))
        .filter(Boolean)
        .map((match) => match[1]);
      dirs.forEach((dir) => {
        current.children[dir] = { children: {}, parent: current, totalSize: 0 };
      });
      if (current.totalSize === 0) {
        const totalSize = results
          .map((line) => line.match(/(\d+) .+/))
          .filter(Boolean)
          .map((match) => parseInt(match[1], 10))
          .reduce((acc, size) => acc + size, 0);
        addSizeToFolder(current, totalSize);
      }
    }
  }

  const freeSpace = 70_000_000 - root.totalSize;
  const sizeToFree = 30_000_000 - freeSpace;

  const sizes = [...directories].map((dir) => dir.totalSize);
  const sortedSizes = sizes.sort((a, b) => a - b);

  const firstSizeToFree = sortedSizes.find((size) => size >= sizeToFree);

  return firstSizeToFree;
};

const input = await fs.readFile("input.txt", "utf-8");
const inputTest = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const run = () => {
  console.log("part1 - test:", part1(inputTest));
  console.log("part1:", part1(input));
  console.log("part2 - test:", part2(inputTest));
  console.log("part2:", part2(input));
};

run();
