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

const createGrid: () => string[][] = () =>
  rotate(
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
  const fromStack = grid[from];
  const itemsToMove = fromStack.slice(fromStack.length - n, fromStack.length);
  grid[from] = fromStack.slice(0, fromStack.length - n);
  grid[to] = grid[to].concat(crane(itemsToMove));
};

const getResult = (grid: Grid) => grid.map((stack) => stack.slice(-1)).join("");

describe("day05", () => {
  test("answer1", () => {
    const grid = createGrid();

    instructions.forEach((instruction) => {
      move(craftMover9000, grid, instruction);
    });

    expect(getResult(grid)).toStrictEqual("JDTMRWCQJ");
  });

  test("answer2", () => {
    const grid = createGrid();
    instructions.forEach((instruction) => {
      move(craftMover9001, grid, instruction);
    });

    expect(getResult(grid)).toStrictEqual("VHJDDCWRD");
  });
});
