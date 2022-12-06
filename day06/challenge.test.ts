import fs from "fs";

const signal = fs.readFileSync(`${__dirname}/input.txt`).toString().split("");

describe("day06", () => {
  const find = (n: number) => (signal: string[]) => {
    for (let i = n; i < signal.length; i += 1) {
      const window = signal.slice(i - n, i);
      if (n == new Set(window).size) {
        return i;
      }
    }
  };

  test("answer1", () => {
    expect(find(4)("bvwbjplbgvbhsrlpgdmjqwftvncz".split(""))).toStrictEqual(5);
    expect(find(4)("nppdvjthqldpwncqszvftbrmjlhg".split(""))).toStrictEqual(6);
    expect(
      find(4)("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg".split(""))
    ).toStrictEqual(10);
    expect(find(4)("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw".split(""))).toStrictEqual(
      11
    );
    expect(find(4)(signal)).toStrictEqual(1538);
  });

  test("answer2", () => {
    expect(find(14)(signal)).toStrictEqual(2315);
  });
});
