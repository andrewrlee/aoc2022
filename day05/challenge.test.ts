import fs from "fs";

type Instruction = { n: number; from: number; to: number };
type Grid = string[][];
type Crane = (items: string[]) => string[];

const craftMover9000: Crane = (items) => items.reverse();
const craftMover9001: Crane = (items) => items;

const input = fs.readFileSync(`${__dirname}/input.txt`).toString().split("\n");

const chunk = <T>(ar: T[], n: number): T[][] => {
  const arr: T[][] = [];
  for (let i = 0; i < ar.length; i += n) {
    arr.push(ar.slice(i, i + n));
  }
  return arr;
};

const rotate = <T>(arr: T[][]) =>
  arr[0].map((_, i) => arr.map((r) => r[i]).reverse());

const grid: Grid = rotate(
  input.reduce((acc, row) => {
    if (row.match(/[\d]+/)?.[0]) return acc;
    return acc.concat([
      chunk(row.split(""), 4)
        .map((cell) => cell.filter((c) => ![" ", "[", "]"].includes(c)))
        .map((c) => c[0]),
    ]);
  }, []) as string[][]
).map((row) => row.filter((c) => c));

const instructions: Instruction[] = input.reduce((acc, row) => {
  const [, n, from, to] = /move (\d+) from (\d+) to (\d+)/?.exec(row) || [];
  if (!n) return acc;
  return acc.concat([
    {
      n: parseInt(n, 10),
      from: parseInt(from, 10) - 1,
      to: parseInt(to, 10) - 1,
    },
  ]);
}, []);

const move = (crane: Crane, grid: Grid, { from, to, n }: Instruction) => {
  const itemsToMove = grid[from].slice(
    grid[from].length - n,
    grid[from].length
  );
  return grid.map((r, i) => {
    if (i === from) return r.slice(0, r.length - n);
    if (i === to) return r.concat(crane(itemsToMove));
    return [...r];
  });
};

const getResult = (grid: Grid, instructions: Instruction[], crane: Crane) => {
  return instructions
    .reduce((acc, instruction) => move(crane, acc, instruction), grid)
    .map((stack) => stack.slice(-1))
    .join("");
};

describe("day05", () => {
  test("answer1", () => {
    expect(getResult(grid, instructions, craftMover9000)).toStrictEqual(
      "JDTMRWCQJ"
    );
  });

  test("answer2", () => {
    expect(getResult(grid, instructions, craftMover9001)).toStrictEqual(
      "VHJDDCWRD"
    );
  });
});
