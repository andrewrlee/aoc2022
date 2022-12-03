import fs from "fs";

type Packet = number | Array<number> | Array<Packet>;
type Pair = [left: Packet, right: Packet];

const pairs: Pair[] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n\n")
  .map(
    (m) =>
      m
        .split("\n")
        .filter((l) => l)
        .map((packet) => JSON.parse(packet)) as Pair
  );

enum Result {
  VALID = 1,
  CONTINUE = 0,
  INVALID = -1,
}

const isValid = ([left, right]: Pair): Result => {
  if (typeof left === "number" && typeof right === "number") {
    if (right > left) {
      return Result.VALID;
    }
    if (right === left) {
      return Result.CONTINUE;
    }
    return Result.INVALID;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      const l = left[i];
      const r = right[i];
      if (l === undefined) return Result.VALID;
      if (r === undefined) return Result.INVALID;
      const result = isValid([l, r]);
      switch (result) {
        case Result.CONTINUE:
          continue;
        default:
          return result;
      }
    }
    return Result.CONTINUE;
  }
  if (Array.isArray(right)) {
    return isValid([[left], right]);
  }
  if (Array.isArray(left)) {
    return isValid([left, [right]]);
  }
  return Result.CONTINUE;
};

describe("day13", () => {
  test("answer1", () => {
    expect(
      pairs
        .map((pair, i) => (isValid(pair) === Result.VALID ? i + 1 : 0))
        .reduce((acc, i) => acc + i)
    ).toStrictEqual(6478);
  });

  test("answer2", () => {
    const answer = pairs
      .flatMap((a) => a)
      .concat([[[6]], [[2]]])
      .sort((a, b) => isValid([b, a]))
      .map((a, i) => {
        if (isValid([a, [[2]]]) == Result.CONTINUE) return i + 1;
        if (isValid([a, [[6]]]) == Result.CONTINUE) return i + 1;
        return 1;
      })
      .reduce((acc, i) => acc * i);
    expect(answer).toStrictEqual(21922);
  });
});
