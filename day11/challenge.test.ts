import fs from "fs";

class Monkey {
  id: string;
  items: number[];
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

  doTurn(): Map<string, number[]> {
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

const monkeys = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n\n")
  .filter((s) => s)
  .map((s) => new Monkey(s.split("\n")));
const monkeyMap = Object.fromEntries(monkeys.map((m) => [m.id, m]));

const doRound = () => {
  monkeys.forEach((monkey) => {
    const assignments = monkey.doTurn();
    assignments.forEach((items, m) => {
      monkeyMap[m].addItems(items);
    });
  });
};

describe("day11", () => {
  test("answer1", () => {
    for (let i = 0; i < 20; i++) {
      doRound();
    }

    const [first, second] = Object.values(monkeyMap)
      .map((m) => m.activity)
      .sort((a, b) => b - a);

    expect(first * second).toStrictEqual(88208);
  });

  test("answer2", () => {
    const answer = -1;
    expect(answer).toStrictEqual(1);
  });

  test("other", () => {
    expect(true).toBe(true);
  });
});
