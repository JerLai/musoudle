import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { count } from 'console';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received for /api/solve-count');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // TODO:
  const env = getCloudflareContext().env;
  const DURABLE_MUSOUDLE_COUNTER: any = env.DURABLE_MUSOUDLE_COUNTER;

  if (!DURABLE_MUSOUDLE_COUNTER) {
    res.status(500).json({ error: 'Counter not available for this environment' });
    return;
  }

  console.log('Fetching counter from Durable Object...');
  const countRes = await DURABLE_MUSOUDLE_COUNTER.handleCommand({ mode: 'classic', action: 'getCount' });
  const countRes = await DURABLE_MUSOUDLE_COUNTER.fetch(countReq);
  const json = await countRes.json();
  // return res.status(200).json({ message: 'Counter fetched successfully', count: json.count });
}
