import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface CharacterData {
  Name: string;
  // Add other properties if needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Access the KV binding
  const kv = getCloudflareContext().env.CHARACTERS_KV;
  if (!kv) {
    res.status(500).json({ error: 'KV binding not available' });
    return;
  }
    const raw = await kv.get("character:previous");
    if (!raw) {
      return res.status(500).json({ error: 'Character data not found for the day' });
    }

    try {
      const character: CharacterData = JSON.parse(raw);
      res.status(200).json({ name: character.Name });
    } catch (err) {
        return res.status(500).json({ error: `Failed to parse character data. Error: ${err}` });
    }
}