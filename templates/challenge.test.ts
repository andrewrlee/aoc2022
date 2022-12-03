import fs from "fs";

const things = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n");

describe("day{{day}}", () => {
  test("answer1", () => {
    const answer = -1;
    expect(answer).toStrictEqual(1);
  });

  test("answer2", () => {
    const answer = -1;
    expect(answer).toStrictEqual(1);
  });

  test("other", () => {
    expect(true).toBe(true);
  });
});
