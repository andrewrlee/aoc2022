import fs from "fs";

type Coord = { x: number; y: number };
type Row = { s: Coord; b: Coord; d: number };

const distance = ({ x: x1, y: y1 }: Coord, { x: x2, y: y2 }: Coord) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const createRows: (name: string) => Row[] = (name) =>
  fs
    .readFileSync(`${__dirname}/${name}.txt`)
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

const minAndMax = (rs: Row[]) => {
  const xs = rs.flatMap((r) => [r.s.x, r.b.x]);
  return [Math.min(...xs), Math.max(...xs)];
};

describe("day15", () => {
  const Slopes = {
    below: { leftSide: 1, rightSide: -1 },
    above: { leftSide: -1, rightSide: 1 },
  };

  enum Type {
    START = "START",
    END = "END",
    POINT = "POINT",
  }
  type Index = { index: number; x: number; type: Type };

  const getIntercepts = (index: number, targetY: number, row: Row): Index[] => {
    const { s, d } = row;
    const slopes = s.y < targetY ? Slopes.below : Slopes.above;

    const left = (targetY - s.y) / slopes.leftSide + (s.x - d);
    const right = (targetY - s.y) / slopes.rightSide + (s.x + d);

    // chosen left but both should be same distance
    if (distance(s, { x: left, y: targetY }) > d) {
      return [];
    }
    return left === right
      ? [{ index, x: left, type: Type.POINT }]
      : [
          { index, x: left, type: Type.START },
          { index, x: right, type: Type.END },
        ];
  };

  const calculateOccupied = (name: string, targetY: number) => {
    const rows = createRows(name);

    const indices = rows
      .flatMap((r, i) => getIntercepts(i, targetY, r))
      .sort(({ x: x1, type: type1 }, { x: x2 }) => {
        if (x1 === x2) {
          return type1 === Type.END ? -1 : 1;
        }
        return x1 - x2;
      });

    const beacons = new Set<number>(
      rows.filter((r) => r.b.y === targetY).map((r) => r.b.x)
    );

    const [min, max] = minAndMax(rows);
    let state = [];
    let count = 0;
    let current = indices.shift();

    for (let i = min; i < max; i++) {
      if (current?.x !== i && !state.length) continue;

      while (current?.x === i) {
        if (current.type == Type.START) {
          state.push(current);
        } else if (current.type == Type.END) {
          state.pop();
        }
        current = indices.shift();
      }
      if (!beacons.has(i)) {
        count++;
      }
    }
    return count;
  };

  test("answer1", () => {
    expect(calculateOccupied("sample", 10)).toStrictEqual(26);
    expect(calculateOccupied("input", 2000000)).toStrictEqual(4879972);
  });

  test("answer2", () => {
    const getPointsAroundCircle = (row: Row) => {
      let current = row.s.y + row.d;
      const indices = [{ x: row.s.x, y: current }];
      while (current > row.s.y - row.d) {
        const intercepts = getIntercepts(0, current, row);
        if (intercepts.length == 2) {
          const [l, r] = intercepts;
          indices.push({ x: l.x - 1, y: current });
          indices.push({ x: r.x + 1, y: current });
        }
        current--;
      }
      indices.push({ x: row.s.x, y: current - 1 });
      return indices;
    };

    const bound = 20;
    const rows = createRows("sample");

    const points = rows
      .flatMap((row) => getPointsAroundCircle(row))
      .filter((point) => point.x < bound && point.y < bound)
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.x === value.x && t.y === value.y)
      )

      .filter((point) => {
        if (point.x == 14 && point.y == 11) {
          console.log(
            rows.map(({ s, d }) => ({
              s,
              r: d,
              d: distance(point, s),
              diff: d - distance(point, s),
            }))
          );
        }
        return (
          rows
            .map(({ s, d }) => ({ s, r: d, d: distance(point, s) }))
            .filter(({ d, r }) => r < d).length === 0
        );
      });

    const a = points[0];
    console.log(a);
    // rows.forEach(({s, d}) => console.log(s, d))
    // console.log(points);
    // console.log(points);
    // console.log(rows[0]);
    // console.log(getPointsAroundCircle(rows[0]));
    console.log(points);
  });
});
