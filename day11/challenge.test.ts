import fs from "fs";

type MonkeyMap = Map<string, Monkey>;

class Monkey {
  id: string;
  items: number[];
  divisor: number;

  operationStmt: string;
  testStmt: string;
  activity: number = 0;

  constructor(private readonly content: string[]) {
    this.id = /Monkey (\d+):/.exec(this.content[0])[1];
    this.items = /\s+Starting items: (.*)/
      .exec(this.content[1])[1]
      .split(", ")
      .map((i) => parseInt(i));
    this.operationStmt = /\s+Operation: (.*)/
      .exec(this.content[2])[1]
      .replaceAll(/\w{3}/g, (w) => w.substring(0, 1));

    const [, d] = /Test: divisible by (\d+)/.exec(content[3]);
    this.divisor = parseInt(d);

    this.testStmt = [content[3], content[4], content[5]]
      .join(" ")
      .replace("Test: divisible by ", "r = ( v % ")
      .replace("    If true: throw to monkey", " == 0 ) ? ")
      .replace("    If false: throw to monkey", " : ");
  }

  execute(o: number) {
    let n = 0;
    eval(this.operationStmt);
    return n;
  }

  testVal(v: number) {
    let r = 0;
    eval(this.testStmt);
    return r.toString();
  }

  addItems(items: number[]) {
    this.items = this.items.concat(items);
  }

  turnAssignments(): Map<string, number[]> {
    this.activity += this.items.length;
    let r = this.items.reduce((results, item) => {
      let newWorryValue = Math.floor(this.execute(item) / 3);
      let destination = this.testVal(newWorryValue);
      let itemsForMonkeys = [
        ...(results.get(destination) || []),
        newWorryValue,
      ];
      results.set(destination, itemsForMonkeys);
      return results;
    }, new Map<string, number[]>());
    this.items = [];
    return r;
  }

  turnAssignmentsForPart2(cd: number): Map<string, number[]> {
    this.activity += this.items.length;
    let r = this.items.reduce((results, item) => {
      let newWorryValue = Math.floor(this.execute(item) / 3);
      let destination = this.testVal(newWorryValue);
      let itemsForMonkeys = [
        ...(results.get(destination) || []),
        newWorryValue,
      ];
      results.set(destination, itemsForMonkeys);
      return results;
    }, new Map<string, number[]>());
    this.items = [];
    return r;
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
        monkey.turnAssignments().forEach((items, m) => {
          monkeys.get(m).addItems(items);
        });
      });
    }

    expect(calculateMonkeyBusiness(monkeys)).toStrictEqual(88208);
  });

  test("answer2", () => {
    const monkeys = createMonkeyMap();
    const cd = Array.from(monkeys.values()).reduce(
      (acc, m) => acc * m.divisor,
      1
    );
    for (let i = 0; i < 20; i++) {
      monkeys.forEach((monkey) => {
        monkey.turnAssignmentsForPart2(cd).forEach((items, m) => {
          monkeys.get(m).addItems(items);
        });
      });
    }

    expect(calculateMonkeyBusiness(monkeys)).toStrictEqual(88208);
  });
});
