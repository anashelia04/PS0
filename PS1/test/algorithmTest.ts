import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  it("should convert a BucketMap to an Array-of-Set representation", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([new Flashcard("front1", "back1", "hint1", [])])],
      [2, new Set([new Flashcard("front2", "back2", "hint2", [])])],
    ]);
    const result = toBucketSets(buckets);
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].size, 1);
    assert.strictEqual(result[1].size, 0);
    assert.strictEqual(result[2].size, 1);
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("should return the range of non-empty buckets", () => {
    const buckets = [
      new Set(),
      new Set([new Flashcard("front1", "back1", "hint1", [])]),
      new Set(),
      new Set([new Flashcard("front2", "back2", "hint2", [])]),
    ];
    const result = getBucketRange(buckets);
    assert.deepStrictEqual(result, { minBucket: 1, maxBucket: 3 });
  });
});

/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("should return cards to practice based on the day", () => {
    const buckets = [
      new Set([new Flashcard("front1", "back1", "hint1", [])]),
      new Set(),
      new Set([new Flashcard("front2", "back2", "hint2", [])]),
    ];
    const result = practice(buckets, 2);
    assert.strictEqual(result.size, 2);
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("should update the bucket of a card based on difficulty", () => {
    const card = new Flashcard("front1", "back1", "hint1", []);
    const buckets: BucketMap = new Map([[0, new Set([card])]]);
    const result = update(buckets, card, AnswerDifficulty.Easy);
    assert.strictEqual(result.get(1)?.has(card), true);
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("should return the hint for a flashcard", () => {
    const card = new Flashcard("front1", "back1", "hint1", []);
    const result = getHint(card);
    assert.strictEqual(result, "Hint: hint1");
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("should compute progress statistics", () => {
    const buckets: BucketMap = new Map([
      [0, new Set()],
      [1, new Set()],
      [2, new Set([new Flashcard("front1", "back1", "hint1", [])])],
    ]);
    const result = computeProgress(buckets, []);
    assert.deepStrictEqual(result, {
      totalCards: 1,
      learnedCards: 0,
      progress: 0,
    });
  });
});
