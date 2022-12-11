import fs from "fs";

type MonkeyMap = Map<string, Monkey>;

class Monkey {
  id: string;
  activity: number = 0;
  items: number[];

  divisor: number;
  trueLoc: string;
  falseLoc: string;

  operationStmt: string;

  constructor(private readonly content: string[]) {
    this.id = /Monkey (\d+):/.exec(this.content[0])[1];
    this.items = /\s+Starting items: (.*)/
      .exec(this.content[1])[1]
      .split(", ")
      .map((i) => parseInt(i));
    this.operationStmt = /\s+Operation: (.*)/
      .exec(this.content[2])[1]
      .replaceAll(/\w{3}/g, (w) => w.substring(0, 1));

    this.divisor = parseInt(/(\d+)/.exec(content[3])[1]);
    this.trueLoc = /(\d+)/.exec(content[4])[1];
    this.falseLoc = /(\d+)/.exec(content[5])[1];
  }

  execute(o: number) {
    let n = 0;
    eval(this.operationStmt);
    return n;
  }

  addItems(items: number[]) {
    this.items = this.items.concat(items);
  }

  turnAssignmentsForPart1(): Map<string, number[]> {
    this.activity += this.items.length;
    const assignments = this.items.reduce((results, item) => {
      const value = Math.floor(this.execute(item) / 3);
      const destination =
        value % this.divisor === 0 ? this.trueLoc : this.falseLoc;
      results.set(destination, [...(results.get(destination) || []), value]);
      return results;
    }, new Map<string, number[]>());
    this.items = [];
    return assignments;
  }

  turnAssignmentsForPart2(lcm: number): Map<string, number[]> {
    this.activity += this.items.length;
    const assignments = this.items.reduce((results, item) => {
      const value = this.execute(item);
      const destination =
        value % this.divisor === 0 ? this.trueLoc : this.falseLoc;
      results.set(destination, [
        ...(results.get(destination) || []),
        // I needed help with this!
        value % lcm,
      ]);
      return results;
    }, new Map<string, number[]>());
    this.items = [];
    return assignments;
  }
}

const createMonkeyMap = (): MonkeyMap =>
  fs
    .readFileSync(`${__dirname}/input.txt`)
    .toString()
    .split("\n\n")
    .filter((s) => s)
    .map((s) => new Monkey(s.split("\n")))
    .reduce((acc, m) => {
      acc.set(m.id, m);
      return acc;
    }, new Map<string, Monkey>());

const calculateMonkeyBusiness = (monkeys: MonkeyMap) => {
  const [first, second] = Array.from(monkeys.values())
    .map((m) => m.activity)
    .sort((a, b) => b - a);
  return first * second;
};

describe("day11", () => {
  test("answer1", () => {
    const monkeys = createMonkeyMap();
    for (let i = 0; i < 20; i++) {
      monkeys.forEach((monkey) => {
        monkey.turnAssignmentsForPart1().forEach((items, m) => {
          monkeys.get(m).addItems(items);
        });
      });
    }

    expect(calculateMonkeyBusiness(monkeys)).toStrictEqual(88208);
  });

  test("answer2", () => {
    const monkeys = createMonkeyMap();

    const lcm = Array.from(monkeys.values()).reduce(
      (acc, m) => acc * m.divisor,
      1
    );

    for (let i = 0; i < 10000; i++) {
      monkeys.forEach((monkey) => {
        monkey.turnAssignmentsForPart2(lcm).forEach((items, m) => {
          monkeys.get(m).addItems(items);
        });
      });
    }

    expect(calculateMonkeyBusiness(monkeys)).toStrictEqual(21115867968);
  });
});
