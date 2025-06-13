import characters from "../data/characters.json"; // adjust if needed

const SEED = "musoudle"; // can be any constant
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Deterministic seed-based PRNG (32-bit FNV-1a hash)
 */
function seedRandom(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13; h ^= h >>> 7;
    h += h << 3; h ^= h >>> 17;
    h += h << 5;
    return (h >>> 0) / 2 ** 32;
  };
}

/**
 * Fisher-Yates shuffle using custom RNG
 */
function fisherYates<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get today's character in the rotation
 */
export function getTodaysCharacter() {
  const roster = [...characters]; // Array of all character objects

  const todayIndex = Math.floor(Date.now() / MS_PER_DAY);
  const cycle = Math.floor(todayIndex / roster.length);
  const offset = todayIndex % roster.length;

  const rng = seedRandom(`${SEED}-${cycle}`);
  const shuffled = fisherYates(roster, rng);

  return shuffled[offset];
}
