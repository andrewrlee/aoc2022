import fs from "fs";

type Packet = number | Array<number> | Array<Packet>;

const pairs: { left: Packet; right: Packet }[] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n\n")

  .map((m) => {
    const [left, right] = m
      .split("\n")
      .filter((l) => l)
      .map((packet) => JSON.parse(packet));

    return { left, right };
  });

enum Result {
  CONTINUE,
  VALID,
  INVALID,
}

const isValid = (left: Packet, right: Packet): Result => {
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
      const result = isValid(l, r);
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
    return isValid([left], right);
  }
  if (Array.isArray(left)) {
    return isValid(left, [right]);
  }
  return Result.VALID;
};

describe("day13", () => {
  test("answer1", () => {
    expect(
      pairs
        .map(({ left, right }, i) =>
          isValid(left, right) === Result.VALID ? i + 1 : 0
        )
        .reduce((acc, i) => acc + i)
    ).toStrictEqual(1);
  });

  test("answer2", () => {
    const answer = -1;
    expect(answer).toStrictEqual(1);
  });

  test("other", () => {
    expect(isValid([[1], [2, 3, 4]], [[1], 4])).toBe(true);
  });
});
