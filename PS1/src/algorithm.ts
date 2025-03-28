/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  const maxBucket = Math.max(...buckets.keys(), 0);
  const bucketArray: Array<Set<Flashcard>> = Array.from({ length: maxBucket + 1 }, () => new Set());
  for (const [bucket, cards] of buckets) {
    bucketArray[bucket] = cards;
  }
  return bucketArray;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  const nonEmptyBuckets = buckets
    .map((set, index) => (set.size > 0 ? index : -1))
    .filter((index) => index !== -1);
  if (nonEmptyBuckets.length === 0) return undefined;
  return {
    minBucket: Math.min(...nonEmptyBuckets),
    maxBucket: Math.max(...nonEmptyBuckets),
  };
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const practiceSet = new Set<Flashcard>();
  buckets.forEach((cards, index) => {
    if (day % (index + 1) === 0) {
      cards.forEach((card) => practiceSet.add(card));
    }
  });
  return practiceSet;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const currentBucket = Array.from(buckets.entries()).find(([_, cards]) =>
    cards.has(card)
  )?.[0];
  if (currentBucket === undefined) return buckets;

  buckets.get(currentBucket)?.delete(card);
  const newBucket =
    difficulty === AnswerDifficulty.Wrong
      ? 0
      : Math.min(currentBucket + difficulty, buckets.size - 1);
  if (!buckets.has(newBucket)) buckets.set(newBucket, new Set());
  buckets.get(newBucket)?.add(card);

  return buckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  return `Hint: ${card.hint}`;
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export function computeProgress(buckets: BucketMap, history: any): any {
  const totalCards = Array.from(buckets.values()).reduce(
    (sum, set) => sum + set.size,
    0
  );
  const learnedCards = buckets.get(buckets.size - 1)?.size || 0;
  return {
    totalCards,
    learnedCards,
    progress: totalCards > 0 ? (learnedCards / totalCards) * 100 : 0,
  };
}
