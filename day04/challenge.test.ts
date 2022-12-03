import fs from "fs";

type Elf = [start: number, end: number];
type ElfTeam = [a: Elf, b: Elf];

const cleanerTeams = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map(
    (s) =>
      s
        .split(",")
        .map((elf) =>
          elf.split("-").map((section) => parseInt(section))
        ) as ElfTeam
  );

describe("day04", () => {
  const overlapsEntirely = ([[aStart, aEnd], [bStart, bEnd]]: ElfTeam) =>
    (bStart >= aStart && bEnd <= aEnd) || (aStart >= bStart && aEnd <= bEnd);

  const overlapsAtAll = ([[aStart, aEnd], [bStart, bEnd]]: ElfTeam) =>
    (aStart >= bStart && aStart <= bEnd) ||
    (bStart >= aStart && bStart <= aEnd);

  test("answer1", () => {
    const answer = cleanerTeams.filter((team) => overlapsEntirely(team)).length;
    expect(answer).toStrictEqual(513);
  });

  test("answer2", () => {
    const answer = cleanerTeams.filter((team) => overlapsAtAll(team)).length;
    expect(answer).toStrictEqual(878);
  });
});
