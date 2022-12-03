import fs from "fs";

const lines = fs.readFileSync(`${__dirname}/input.txt`).toString().split("\n");

type Entry = File | Dir;

class File {
  public constructor(public name: string, public length: number) {}
  getSize = () => this.length;
  getAsListOfDirs = (): Dir[] => [];
}

class Dir {
  root: Dir;

  static root = () => {
    const r = new Dir(undefined, undefined, "/");
    r.root = r;
    return r;
  };

  public constructor(
    public rootDir: Dir,
    public parent: Dir,
    public name: string,
    public children: Entry[] = []
  ) {}

  public add(line: string): Dir {
    if (!line || line === "$ ls") return this;
    if (line.indexOf("$ cd") > -1) {
      const location = line.substring(4).trim();
      switch (location) {
        case "/":
          return this.root;
        case "..":
          return this.parent;
        default:
          return this.getChild(location);
      }
    }
    if (line.startsWith("dir ")) {
      this.children.push(new Dir(this.root, this, line.substring(4).trim()));
      return this;
    }

    const [, size, name] = /(\d+) (.*)/.exec(line);
    this.children.push(new File(name, parseInt(size)));
    return this;
  }

  getChild = (name: string): Dir =>
    this.children.find((c) => c.name === name) as Dir;

  getSize = (): number =>
    this.children.reduce((total, entry) => (total += entry.getSize()), 0);

  getAsListOfDirs = (): Entry[] => {
    const descendents = this.children.flatMap((c) => c.getAsListOfDirs());
    return ([this] as Entry[]).concat(descendents);
  };
}

describe("day07", () => {
  const rootDir = lines.reduce(
    (currentDir, line) => currentDir.add(line),
    Dir.root()
  ).rootDir;

  test("answer1", () => {
    expect(
      rootDir
        .getAsListOfDirs()
        .filter((c) => c.getSize() <= 100000)
        .reduce((acc, i) => acc + i.getSize(), 0)
    ).toStrictEqual(1743217);
  });

  test("answer2", () => {
    const spaceToFree = 30000000 - (70000000 - rootDir.getSize());

    expect(
      rootDir
        .getAsListOfDirs()
        .sort((a, b) => a.getSize() - b.getSize())
        .find((c) => c.getSize() > spaceToFree)
        .getSize()
    ).toStrictEqual(8319096);
  });
});
