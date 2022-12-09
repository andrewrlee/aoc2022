import fs from "fs";

type Coordinates = [number, number];
type Tree = [height: number, coordinates: Coordinates];

const trees: Tree[][] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .filter((l) => l)
  .map((row, y) => row.split("").map((col, x) => [parseInt(col), [x, y]]));

const rotate = <T>(arr: T[][]) =>
  arr[0].map((_, i) => arr.map((r) => r[i]).reverse());

describe("day08", () => {
  test("answer1", () => {
    const visibleTrees = (trees: Tree[]) =>
      trees.reduce((visible, tree) => {
        const lastVisibleTreeHeight = visible.slice(-1)?.[0]?.[0] || 0;
        if (tree[0] > lastVisibleTreeHeight) {
          visible.push(tree);
        }
        return visible;
      }, []);

    const countAllVisibleTrees = () => {
      const perspectives = [
        trees,
        rotate(trees),
        rotate(rotate(trees)),
        rotate(rotate(rotate(trees))),
      ];
      const visible = perspectives
        .flatMap((p) => p)
        .reduce((visible, row) => {
          visibleTrees(row).forEach((tree) => visible.add(tree));
          return visible;
        }, new Set<Tree>());

      // Ensure all external trees are visible
      perspectives.forEach((p) => p[0].forEach((t) => visible.add(t)));
      return visible.size;
    };

    expect(countAllVisibleTrees()).toStrictEqual(1832);
  });

  test("answer2", () => {
    const findCountTilNextTree =
      ([modx, mody]: Coordinates) =>
      (tree: Tree) => {
        let current = tree;
        let thisHeight = current[0];
        let count = 0;
        while (true) {
          const [, [oldX, oldY]] = current;
          const x = oldX + modx;
          const y = oldY + mody;

          const found = trees[y]?.[x];
          if (found == undefined) break;
          count += 1;
          if (found[0] >= thisHeight) break;
          current = found;
        }
        return count;
      };

    const directions: Coordinates[] = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    const calcScore = (t: Tree) =>
      directions.reduce(
        (acc, direction) => acc * findCountTilNextTree(direction)(t),
        1
      );

    const answer = Math.max(...trees.flat(1).map((t) => calcScore(t)));

    expect(answer).toStrictEqual(157320);
  });
});
