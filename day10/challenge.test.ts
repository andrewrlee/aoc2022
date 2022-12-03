import fs from "fs";

type Operation = { op: string; value: number };

const operations: Operation[] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map((r) => {
    const [op, n] = r.split(" ");
    return { op, value: parseInt(n) };
  });

let index = 0;
const nextOp = () => operations[index++ % operations.length];

const SCREENSIZE = 240;

let cyclesRemain = 1;
let x: number = 1;
let currentOp: Operation = undefined;
let values = 0;
let display = "";

const drawPixel = (tick: number, x: number): string => {
  const pos = tick % 40;
  const nl = pos == 0 ? "\n" : "";
  return pos >= x - 1 && pos <= x + 1 ? `${nl}#` : `${nl} `;
};

for (let tick = 1; tick <= SCREENSIZE; tick++) {
  if (!currentOp) {
    currentOp = nextOp();
    cyclesRemain = currentOp.op == "noop" ? 0 : 1;
  }

  if ([20, 60, 100, 140, 180, 220].includes(tick)) {
    values += tick * x;
  }

  if (cyclesRemain <= 0) {
    x += currentOp?.value || 0;
    currentOp = undefined;
  }
  display += drawPixel(tick, x);

  cyclesRemain--;
}

describe("day10", () => {
  test("answer1", () => {
    const answer = values;

    expect(answer).toStrictEqual(15260);
  });

  test("answer2", () => {
    expect(display).toStrictEqual(
      `
 ##   ##  #  # ####  ##  #    #  #  ##  
#  # #  # #  # #    #  # #    #  # #  # 
#  # #    #### ###  #    #    #  # #    
###  # ## #  # #    # ## #    #  # # ## 
#    #  # #  # #    #  # #    #  # #  # 
#     ### #  # #     ### ####  ##   ### 
 `.trimStart()
    );
  });
});
