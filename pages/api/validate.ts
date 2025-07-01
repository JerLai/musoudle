import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';


interface CharacterData {
  Name: string;
  "Faction(s)": string;
  "Playable Debut": string;
  "Weapon Type": string;
  Born: string;
  Died: string;
  Gender: string;
  Height: string;
  Hint: string;
  // Add other properties if needed
}

interface ComparisonResult {
  Name: string;
  "Faction(s)": { value: string; match: number };
  "Playable Debut": { value: string; match: number };
  "Weapon Type": { value: string; match: number };
  Born: { value: string; match: number };
  Died: { value: string; match: number };
  Gender: { value: string; match: number };
  Height: { value: string; match: number };
}

interface Guess {
  correct: boolean;
  comparisonResult: ComparisonResult;
}

interface UserGuesses {
  guesses: Guess[];
  solved: boolean;
  hint: string | undefined;
}
let charToday: { data: CharacterData } | null = null;

/**
 * Determines the overlap status between a guessed character and the actual character.
 * @param guess The guessed character data.
 * @param character The actual character data.
 * @returns An object with the guess character properties and their overlap status.
 */
export function determineOverlapStatus(
  guess: CharacterData,
  character: CharacterData
): ComparisonResult {
  return {
    "Faction(s)": {
      value: guess["Faction(s)"],
      match: categoryContains(guess["Faction(s)"], character["Faction(s)"]),
    },
    "Playable Debut": {
      value: guess["Playable Debut"],
      match: guess["Playable Debut"] === character["Playable Debut"] ? 2 : 0,
    },
    Born: {
      value: guess.Born,
      match: guess.Born === character.Born ? 2 : 0,
    },
    Died: {
      value: guess.Died,
      match: guess.Died === character.Died ? 2 : 0,
    },
    "Weapon Type": {
      value: guess["Weapon Type"],
      match: categoryContains(guess["Weapon Type"], character["Weapon Type"]),
    },
    Gender: {
      value: guess.Gender,
      match: guess.Gender === character.Gender ? 2 : 0,
    },
    Height: {
      value: guess.Height,
      match: guess.Height === character.Height ? 2 : 0,
    },
    Name: guess.Name, // If you want to keep Name as a string
  };
}
function fullMatchObject(character: CharacterData): ComparisonResult {
  return {
    "Faction(s)": { value: character["Faction(s)"], match: 2 },
    "Playable Debut": { value: character["Playable Debut"], match: 2 },
    Born: { value: character.Born, match: 2 },
    Died: { value: character.Died, match: 2 },
    "Weapon Type": { value: character["Weapon Type"], match: 2 },
    Gender: { value: character.Gender, match: 2 },
    Height: { value: character.Height, match: 2 },
    Name: character.Name, // If you want to keep Name as a string
  };
}

export function categoryContains(
  guess: string,
  character: string
): number {
  const guessItems = guess.split(",").map(item => item.trim());
  const characterItems = character.split(",").map(item => item.trim());

  // If the lengths are equal, check if any of the items match, and if all items match, indicate a full match
  if (guessItems.length === characterItems.length && characterItems.every(item => guessItems.includes(item))) {
    return 2;
  }

  // If the guess has less items than the character of the day, just check if any of the guessed items match for a partial match
  if (guessItems.some(item => characterItems.includes(item))) {
    return 1;
  }

  return 0; // No match
}

function getUidFromCookie(req: NextApiRequest): string | undefined {
  const cookie = req.headers.cookie;
  if (!cookie) return undefined;
  const match = cookie.match(/musoudle_uid=([^;]+)/);
  return match ? match[1] : undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received for /api/validate');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const uid = getUidFromCookie(req);
  if (!uid) {
    return res.status(400).json({ error: 'User ID not found in cookies' });
  }

  const body = req.body;
  // Ensure body is an object with a 'guess' property
  if (typeof body !== "object" || body === null || !("guess" in body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const guess = body.guess;

  const kv = getCloudflareContext().env.CHARACTERS_KV;
  // If this worker is a cold start, we need to fetch the character data from the KV store
  if (!charToday) {
    const raw = await kv.get("character:today");
    if (!raw) {
      return res.status(404).json({ error: "No character selected for today." });
    }

    try {
      charToday = { data: JSON.parse(raw) };
    } catch (err) {
      return res.status(500).json({ error: `Failed to parse character data. Error: ${err}` });
    }
  }

  const day = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  const userGuessKey = `guesses:${uid}:${day}`;
  const guessKv = getCloudflareContext().env.USER_GUESSES_KV;
  // Attempt to get the existing guesses (if any) for the user on this day
  const existingGuessesRaw = await guessKv.get(userGuessKey);

  if (guess === charToday.data.Name) {
    const fullMatch: ComparisonResult = fullMatchObject(charToday.data);
    const userGuesses: UserGuesses = {
      guesses: [],
      solved: true,
      hint: charToday.data.Hint,
    };
    const guess: Guess = {
      correct: true,
      comparisonResult: fullMatch
    };

    if (!existingGuessesRaw) {
      userGuesses.guesses = [guess];
    } else {
      const existingGuesses = JSON.parse(existingGuessesRaw);
      userGuesses.guesses = [guess, ...existingGuesses.guesses];
    }

    await guessKv.put(userGuessKey, JSON.stringify(userGuesses));
    const totalGuesses = userGuesses.guesses.length;
    const hint: string | undefined = totalGuesses >= 4 ? charToday.data.Hint : undefined;
    return res.status(200).json({ correct: true, comparisonResult: fullMatch, hint });
  }

  // As the name is not correct, we need to fetch the data for the guessed character
  const guessRaw = await kv.get(`character:${guess?.replaceAll(" ", "")}`);
  // Compare the data between the guessed character and the character for today
  const parseGuess = guessRaw ? JSON.parse(guessRaw) : null;
  const comparison = determineOverlapStatus(parseGuess, charToday.data);

  const userGuesses: UserGuesses = {
    guesses: [],
    solved: false,
    hint: undefined
  };

  const wrongGuess: Guess = {
    correct: false,
    comparisonResult: comparison
  };

  if (!existingGuessesRaw) {
    userGuesses.guesses = [wrongGuess];
  } else {
      const existingGuesses = JSON.parse(existingGuessesRaw);
      userGuesses.guesses = [wrongGuess, ...existingGuesses.guesses];
  }
  const totalGuesses = userGuesses.guesses.length;
  const hint: string | undefined = totalGuesses >= 4 ? charToday.data.Hint : undefined;
  userGuesses.hint = hint;
  await guessKv.put(userGuessKey, JSON.stringify(userGuesses));

  return res.status(200).json({
    correct: false,
    comparisonResult: comparison,
    hint
  });
}
