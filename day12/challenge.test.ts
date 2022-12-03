import fs from "fs";

type NodeType = "S" | "E" | "N";
type Node = { x: number; y: number; h: number; type: NodeType };

const getHeight = (c: string) => {
  if (c === "S") return "a".charCodeAt(0);
  if (c === "E") return "z".charCodeAt(0);
  return c.charCodeAt(0);
};

const getType = (c: string) => {
  if (c === "S") return "S";
  if (c === "E") return "E";
  return "N";
};

const nodes: Node[][] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map((row, r) =>
    row.split("").map((cell, col) => ({
      x: col,
      y: r,
      h: getHeight(cell),
      type: getType(cell),
    }))
  );

const start = nodes.flatMap((row) => row).find((n) => n.type === "S");
const end = nodes.flatMap((row) => row).find((n) => n.type === "E");

const getAdjacents = (nodes: Node[][], { x, y, h }: Node): Node[] =>
  [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]
    .map((d) => nodes[y + d[1]]?.[x + d[0]])
    .filter((c) => c)
    .filter((s) => h + 1 >= s.h);

const findShortestPath = (start: Node, end: Node): number => {
  const seen = new Set<Node>();
  const prevNodes = new Map<Node, Node>();
  const shortestPaths = new Map<Node, number>();

  shortestPaths.set(start, 0);

  const queue = [start];

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode === end) break;
    if (seen.has(currentNode)) continue;

    seen.add(currentNode);
    const dist = shortestPaths.get(currentNode);

    for (let n of getAdjacents(nodes, currentNode)) {
      if (!seen.has(n)) {
        queue.push(n);
      }
      const childDist = dist + 1;

      if (!prevNodes.has(n) || shortestPaths.get(n) < childDist) {
        shortestPaths.set(n, childDist);
        prevNodes.set(n, currentNode);
      }
    }
  }

  return shortestPaths.get(end);
};

describe("day12", () => {
  test("answer1", () => {
    expect(findShortestPath(start, end)).toStrictEqual(481);
  });

  test("answer2", () => {
    const starts = nodes
      .flatMap((row) => row)
      .filter((n) => n.h === "a".charCodeAt(0));

    const lowest = starts
      .map((s) => findShortestPath(s, end))
      .sort((a, b) => a - b)[0];

    expect(lowest).toStrictEqual(480);
  });
});
