import fs from "fs";

const elves = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n\n");

const calculateTotalCalories = (elf: string) => {
  const allCalories = elf.split("\n").map((i) => parseInt(i));
  return allCalories.reduce((acc, i) => acc + i);
};

describe("day01", () => {
  test("answer1", () => {
    const answer = Math.max(...elves.map((elf) => calculateTotalCalories(elf)));

    expect(answer).toBe(72070);
  });

  test("answer2", () => {
    const maxCaloriesToLow = elves
      .map((elf) => calculateTotalCalories(elf))
      .sort((a, b) => a - b)
      .reverse();

    const answer =
      maxCaloriesToLow[0] + maxCaloriesToLow[1] + maxCaloriesToLow[2];

    expect(answer).toBe(211805);
  });
});
