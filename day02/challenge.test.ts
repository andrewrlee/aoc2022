import fs from "fs";

enum Move {
  ROCK,
  PAPER,
  SCISSORS,
}
enum Outcome {
  WIN,
  LOSE,
  DRAW,
}
type MoveInfo = {
  move: Move;
  score: number;
  equivs: string[];
  wins: Move;
  losesTo: Move;
};

const outcomeScores: Map<Outcome, number> = new Map([
  [Outcome.WIN, 6],
  [Outcome.DRAW, 3],
  [Outcome.LOSE, 0],
]);

const moveTypes: MoveInfo[] = [
  {
    move: Move.ROCK,
    score: 1,
    equivs: ["X", "A"],
    losesTo: Move.PAPER,
    wins: Move.SCISSORS,
  },
  {
    move: Move.PAPER,
    score: 2,
    equivs: ["Y", "B"],
    losesTo: Move.SCISSORS,
    wins: Move.ROCK,
  },
  {
    move: Move.SCISSORS,
    score: 3,
    equivs: ["Z", "C"],
    losesTo: Move.ROCK,
    wins: Move.PAPER,
  },
];

const getMove = (s: string) =>
  moveTypes.find((move) => move.equivs.includes(s));

const rounds = fs.readFileSync(`${__dirname}/input.txt`).toString().split("\n");

const getOutcome = (ours: MoveInfo, theirs: MoveInfo): Outcome => {
  if (ours.move === theirs.move) return Outcome.DRAW;
  return theirs.losesTo == ours.move ? Outcome.WIN : Outcome.LOSE;
};

describe("day02", () => {
  test("answer1", () => {
    const calculateScore = (round: string) => {
      const [theirs, ours] = round.split(" ");
      const theirMove = getMove(theirs);
      const ourMove = getMove(ours);
      const outcome = getOutcome(ourMove, theirMove);
      return ourMove.score + outcomeScores.get(outcome);
    };

    const answer = rounds
      .map((r) => calculateScore(r))
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(13446);
  });

  test("answer2", () => {
    const desiredOutcomes: Map<string, Outcome> = new Map([
      ["X", Outcome.LOSE],
      ["Y", Outcome.DRAW],
      ["Z", Outcome.WIN],
    ]);

    const getDesiredMove = (theirMove: MoveInfo, s: string) => {
      const desiredOutcome = desiredOutcomes.get(s);
      switch (desiredOutcome) {
        case Outcome.LOSE:
          return moveTypes.find((move) => move.losesTo === theirMove.move);
        case Outcome.DRAW:
          return moveTypes.find((move) => move.move === theirMove.move);
        case Outcome.WIN:
          return moveTypes.find((move) => move.wins === theirMove.move);
      }
    };

    const calculateScore = (round: string) => {
      const [theirs, ours] = round.split(" ");
      const theirMove = getMove(theirs);
      const ourMove = getDesiredMove(theirMove, ours);
      const outcome = getOutcome(ourMove, theirMove);
      return ourMove.score + outcomeScores.get(outcome);
    };

    const answer = rounds
      .map((r) => calculateScore(r))
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(13509);
  });
});
