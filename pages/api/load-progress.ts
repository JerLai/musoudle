import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';

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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request received for /api/load-progress');
  const cookie = req.headers.cookie || '';
  const uidMatch = cookie.match(/uid=([^;]+)/);
  const uid = uidMatch?.[1];
  if (req.method !== 'GET' || !uid) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const day = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  const userGuessKey = `guesses:${uid}:${day}`;
  const guessKv = getCloudflareContext().env.USER_GUESSES_KV;

  const existingGuessesRaw = await guessKv.get(userGuessKey);
  if (!existingGuessesRaw) {
    return res.status(200).json({ guesses: [], solved: false });
  }

  return res.status(200).json(JSON.parse(existingGuessesRaw) as UserGuesses);
}
