import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';


interface CharacterData {
  Name: string;
  "Faction(s)": string;
  "Playable Debut": string;
  "Weapon Type": string;
  Born: number;
  Died: number;
  Gender: string;
  Height: string;
  Hint: string;
  // Add other properties if needed
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
) {
  return {
    "Faction(s)": {
      value: guess["Faction(s)"],
      match: categoryContains(guess["Faction(s)"], character["Faction(s)"]),
    },
    "Playable Debut": {
      value: guess["Playable Debut"],
      match: guess["Playable Debut"] === character["Playable Debut"],
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
function fullMatchObject(character: CharacterData) {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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

  if (guess === charToday.data.Name) {
    const fullMatch = fullMatchObject(charToday.data);
    return res.status(200).json({ correct: true, characterData: fullMatch });
  } else {
    // As the name is not correct, we need to fetch the data for the guessed character
    const guessRaw = await kv.get(`character:${guess?.replaceAll(" ", "")}`);
    // Compare the data between the guessed character and the character for today
    const parseGuess = guessRaw ? JSON.parse(guessRaw) : null;
    const comparison = determineOverlapStatus(parseGuess, charToday.data);
    return res.status(200).json({
      correct: false,
      characterData: comparison,
    });
  }
}

