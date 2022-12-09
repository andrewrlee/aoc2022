import fs from "fs";

type Coordinates = [number, number];
type Direction = "U" | "D" | "L" | "R";
type Instruction = [direction: Direction, magnitude: number];

const instructions: Instruction[] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .filter((l) => l)
  .map((l) => {
    const [d, n] = l.split(" ");
    return [d as Direction, parseInt(n)];
  });

const nextHead = (
  [x, y]: Coordinates,
  [direction]: Instruction
): Coordinates => {
  switch (direction) {
    case "U":
      return [x, y - 1];
    case "D":
      return [x, y + 1];
    case "L":
      return [x - 1, y];
    case "R":
      return [x + 1, y];
  }
};

const distanceBetween = ([x1, y1]: Coordinates, [x2, y2]: Coordinates) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

const nextTail = (head: Coordinates, tail: Coordinates): Coordinates => {
  const distance = distanceBetween(head, tail);
  if (distance < 2) {
    return tail;
  }
  const tailX = tail[0] + Math.sign(head[0] - tail[0]);
  const tailY = tail[1] + Math.sign(head[1] - tail[1]);
  return [tailX, tailY];
};

describe("day09", () => {
  test("answer1", () => {
    let currentHead: Coordinates = [0, 0];
    let currentTail: Coordinates = [...currentHead];
    const tails: Set<Coordinates> = new Set<Coordinates>([currentTail]);

    instructions.forEach((instruction) => {
      const distance = instruction[1];
      for (let i = 0; i < distance; i++) {
        currentHead = nextHead(currentHead, instruction);
        currentTail = nextTail(currentHead, currentTail);
        tails.add(currentTail);
      }
    });

    const result = new Set(Array.from(tails).map(([x, y]) => `${x}-${y}`)).size;
    expect(result).toEqual(6494);
  });

  test("answer2", () => {
    let currentHead: Coordinates = [0, 0];
    let currentTails: Coordinates[] = Array(9).fill(currentHead);
    const result: Set<Coordinates> = new Set<Coordinates>([currentHead]);

    instructions.forEach((instruction) => {
      const distance = instruction[1];
      for (let i = 0; i < distance; i++) {
        currentHead = nextHead(currentHead, instruction);
        currentTails = currentTails.reduce((acc, i) => {
          if (acc.length == 0) return [nextTail(currentHead, i)];
          return [...acc, nextTail(acc.slice(-1)[0], i)];
        }, [] as Coordinates[]);

        result.add(currentTails[8]);
      }
    });
    const r = new Set(Array.from(result).map(([x, y]) => `${x}-${y}`)).size;

    expect(r).toEqual(2691);
  });
});
