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

const getAdjacents = (nodes: Node[][], node: Node): Node[] => {
  const { x, y, h } = node;
  const directions: [number, number][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  return directions
    .map((d) => nodes[y + d[1]]?.[x + d[0]])
    .filter((c) => c)
    .filter((s) => h + 1 >= s.h);
};

describe("day12", () => {
  test("answer1", () => {
    const seen = new Set<Node>();
    const prevNodes = new Map<Node, Node>();
    const shortestPaths = new Map<Node, number>();

    const start = nodes.flatMap((row) => row).find((n) => n.type === "S");
    const end = nodes.flatMap((row) => row).find((n) => n.type === "E");

    shortestPaths.set(start, 0);

    const queue = [start];
    
    while (queue.length > 0) {
    
      const currentNode = queue.shift();
      if (seen.has(currentNode)) {
        continue;
      }
      if (currentNode === end) break;
      seen.add(currentNode);

      const dist = shortestPaths.get(currentNode);

      const neighbours = getAdjacents(nodes, currentNode);
      for (let n of neighbours) {
        if (!seen.has(n)) {
          queue.push(n);
        }
        const childDist = dist + 1;

        if (prevNodes.has(n)) {
          if (shortestPaths.get(n) < childDist) {
            shortestPaths.set(n, childDist);
            prevNodes.set(n, currentNode);
          }
        } else {
          shortestPaths.set(n, childDist);
          prevNodes.set(n, currentNode);
        }
      }
    }

    console.log(shortestPaths.get(end));

    expect(shortestPaths.get(end)).toStrictEqual(481) 
  });

  test("answer2", () => {
    const answer = -1;
    expect(answer).toStrictEqual(1);
  });

  test("other", () => {
    expect(true).toBe(true);
  });
});
