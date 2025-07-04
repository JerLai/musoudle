import type { NextApiRequest, NextApiResponse } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received for /api/count');
  // TODO: when more modes get implemented, get them from searchParams
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // TODO(low prio): Move Counter Worker to its own folder in this to make monorepo, reference class type to do RPC method
  const env = getCloudflareContext().env;
  // const DURABLE_MUSOUDLE_COUNTER = env.DURABLE_MUSOUDLE_COUNTER as CounterService;

  // if (!DURABLE_MUSOUDLE_COUNTER) {
  //   res.status(500).json({ error: 'Counter not available for this environment' });
  //   return;
  // }
  //const countInfo = await DURABLE_MUSOUDLE_COUNTER.handleCommand({ mode: 'classic', action: 'getCount' });
  const MUSOUDLE_COUNTER_WS = env.MUSOUDLE_COUNTER_WS;
  console.log('Fetching counter from Durable Object...');
  const countRes = await fetch(`${MUSOUDLE_COUNTER_WS}/classic`);
  const countJson = await countRes.json();

  console.log('Counter json:', countJson);
  return res.status(200).json(countJson);
}
