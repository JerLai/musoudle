import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received for /api/classic');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const env = getCloudflareContext().env;
  const CHARACTERS_KV = env.CHARACTERS_KV;

  if (!CHARACTERS_KV) {
    res.status(500).json({ error: 'KV binding not available' });
    return;
  }

  await CHARACTERS_KV.put("test", "foo");
  return res.status(200).json({ message: 'Test successful' });
}