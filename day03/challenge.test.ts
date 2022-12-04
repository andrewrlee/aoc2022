import fs from "fs";

type Sections = string[][];

const rucksacks = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n");

const getPriority = (s: string) => s.charCodeAt(0) - (s < "a" ? 38 : 96);


const getSections = (rucksack: string): Sections => {
  const letters = rucksack.split("");
  return [
    letters.slice(0, letters.length / 2),
    letters.slice(letters.length / 2, letters.length),
  ];
};

const getFreqs = (section: string[]) =>
  section.reduce((acc, i) => {
    const count = (acc.get(i) || 0) + 1;
    acc.set(i, count);
    return acc;
  }, new Map<string, number>());

const getSharedItemPriority = ([first, ...sections]: Sections) => {
  const freqs = sections.map((s) => getFreqs(s));
  const matchingItem = first.find((s) => freqs.every((f) => f.has(s)));
  return getPriority(matchingItem);
};

describe("day03", () => {
  test("answer1", () => {
    const answer = rucksacks
      .map((r) => getSections(r))
      .map((s) => getSharedItemPriority(s))
      .reduce((acc, i) => acc + i);

    expect(answer).toStrictEqual(7845);
  });

  test("answer2", () => {
    const groups = [];
    for (let i = 0; i < rucksacks.length; i += 3) {
      groups.push(rucksacks.slice(i, i + 3).map((s) => s.split("")));
    }

    const answer = groups
      .map((c) => getSharedItemPriority(c))
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(2790);
  });

  test("other", () => {
    expect(getPriority("a")).toBe(1);
    expect(getPriority("z")).toBe(26);
    expect(getPriority("A")).toBe(27);
    expect(getPriority("Z")).toBe(52);

    expect(getSections("abc123")).toStrictEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
    expect(
      getSharedItemPriority(getSections("CrZsJsPPZsGzwwsLwLmpwMDw"))
    ).toStrictEqual(19);
  });
});
