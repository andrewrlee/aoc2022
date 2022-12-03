import fs from "fs";

type Coordinate = [x: number, y: number];
type CoordWithVal<T> = { x: number; y: number; value: T };
type Grid<T> = CoordWithVal<T>[][];

const slidingWindow = <T>(items: T[]): [first: T, second: T][] => {
  const result: [first: T, second: T][] = [];
  for (let i = 1; i < items.length; i++) {
    result.push([items[i - 1], items[i]]);
  }
  return result;
};

const findPath = (start: Coordinate, end: Coordinate): Coordinate[] => {
  const [endX, endY] = end;
  let [currentX, currentY] = start;
  const xMod = Math.sign(endX - currentX);
  const yMod = Math.sign(endY - currentY);
  const result: Coordinate[] = [start];
  while (currentX !== endX || currentY !== endY) {
    result.push([(currentX += xMod), (currentY += yMod)]);
  }
  return result;
};

const walls = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .filter((s) => s)
  .map((row) => {
    const coords = row
      .split(" -> ")
      .map((c) => c.split(",").map((a) => parseInt(a)) as Coordinate);
    return slidingWindow(coords).map(([start, end]) => findPath(start, end));
  })
  .flat(2);

const maxX = Math.max(...walls.map(([x, _]) => x));
const maxY = Math.max(...walls.map(([_, y]) => y));

const createGrid = <T>([maxX, maxY]: Coordinate, defaultValue: T): Grid<T> => {
  const rows: CoordWithVal<T>[][] = [];
  for (let y = 0; y < maxY + 1; y++) {
    const row: CoordWithVal<T>[] = [];
    for (let x = 0; x < maxX + 1; x++) {
      row.push({ x, y, value: defaultValue });
    }
    rows.push(row);
  }
  return rows;
};

const rotate = <T>(arr: T[][]) =>
  arr[0].map((_, i) => arr.map((r) => r[i]).reverse());

const populateGrid = <T>(grid: Grid<T>, values: Coordinate[], fillValue: T) => {
  values.forEach(([x, y]) => {
    grid[y][x].value = fillValue;
  });
};

const tickUnit = (grid: Grid<string>) => {
  const rGrid = rotate(grid);

  const findFirstPoint = () => findDownFrom(500);
  const findDownFrom = (x: number, xMin: number = 0) => {
    const a = [...rGrid[x]].reverse().slice(xMin);
    const i = a.findIndex(({ value }) => value !== ".");
    return a.at(i - 1);
  };

  const findNextPoint = (
    current: CoordWithVal<string>
  ): CoordWithVal<string> => {
    if (!current) return undefined;
    const { x, y } = current;
    const left = grid[y + 1]?.[x - 1];
    const below = grid[y + 1]?.[x];
    const right = grid[y + 1]?.[x + 1];
    if (left?.value === ".") return findNextPoint(findDownFrom(left.x, y + 1));
    if (right?.value === ".")
      return findNextPoint(findDownFrom(right.x, y + 1));
    if (below?.value === ".") return findNextPoint(below);
    else return current;
  };

  return () => findNextPoint(findFirstPoint());
};

describe("day14", () => {
  test("answer1", () => {
    const grid = createGrid([maxX, maxY], ".");
    populateGrid(grid, walls, "#");
    const nextDestination = tickUnit(grid);

    const answer = () => {
      for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
        const destination = nextDestination();
        if (!destination) {
          return i;
        }
        destination.value = "o";
      }
    };

    expect(answer()).toStrictEqual(1068);
  });

  test("answer2", () => {
    const grid = createGrid([maxX + 500, maxY + 2], ".");
    const floor = findPath([0, maxY + 2], [maxX + 100, maxY + 2]);
    populateGrid(grid, [...walls, ...floor], "#");

    const nextDestination = tickUnit(grid);

    const answer = () => {
      for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
        if (grid[0][500].value === "o") {
          return i;
        }
        const destination = nextDestination();
        destination.value = "o";
      }
    };

    expect(answer()).toStrictEqual(27936);
  });
});
