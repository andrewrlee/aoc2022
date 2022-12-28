import fs from "fs";

type Coord = { x: number; y: number };
type Row = { s: Coord; b: Coord; d: number };

const distance = ({ x: x1, y: y1 }: Coord, { x: x2, y: y2 }: Coord) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const rows: Row[] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .filter((a) => a)
  .map((line) => {
    const [x1, y1, x2, y2] = /.*?(-*\d+).*?(-*\d+).*?(-*\d+).*?(-*\d+).*/
      .exec(line)
      .slice(1)
      .map((s) => parseInt(s));
    return {
      s: { x: x1, y: y1 },
      b: { x: x2, y: y2 },
      d: distance({ x: x1, y: y1 }, { x: x2, y: y2 }),
    };
  });

const findPath = (start: Coord, { x: endX, y: endY }: Coord): Coord[] => {
  let { x: currentX, y: currentY } = start;
  const xMod = Math.sign(endX - currentX);
  const yMod = Math.sign(endY - currentY);
  const result: Coord[] = [start];
  while (currentX !== endX || currentY !== endY) {
    result.push({ x: (currentX += xMod), y: (currentY += yMod) });
  }
  return result;
};

const minAndMax = () => {
  let lowX = Number.MAX_SAFE_INTEGER;
  let highX = Number.MIN_SAFE_INTEGER;

  rows.forEach(({ s: { x: x1 }, b: { x: x2 }}) => {
    lowX = Math.min(lowX, x1, x2);
    highX = Math.max(highX, x1, x2);
  });
  return [lowX, highX];
};

describe("day15", () => {
  test("answer1", () => {
    const [minX, maxX] = minAndMax();

    const path = findPath({ x: minX, y: 2000000 }, { x: maxX, y: 2000000 }).filter(
      (loc) =>
        rows.some(
          (row) =>
            !(row.b.x == loc.x && row.b.y == loc.y) &&
            distance(loc, row.s) <= row.d
        )
    );
    
    expect(path.length).toStrictEqual(4879972);
  });

  test("answer2", () => {
    const answer = -1;
    expect(answer).toStrictEqual(1);
  });

  test("other", () => {
    expect(true).toBe(true);
  });
});
