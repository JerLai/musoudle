import { seededShuffle } from './utils/utils';

interface Env {
  CHARACTERS_KV: KVNamespace;
}

interface CharacterData {
  Name: string;
  // other fields optional
}

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext,
  ) {
    console.log("cron processed");
    const kv = env.CHARACTERS_KV;

    // Get rotation state
    let index = parseInt(await kv.get("rotationIndex") || "0", 10);
    let cycle = parseInt(await kv.get("rotationCycle") || "1", 10);

    // List all character keys
    const names: string[] = [];

    const list: KVNamespaceListResult<unknown> = await kv.list();
    const values: (string | null)[] = await Promise.all(
      list.keys.map(async (key: KVNamespaceListKey<unknown>): Promise<string | null> => {
        const raw: string | null = await env.CHARACTERS_KV.get(key.name);
        if (raw) {
          try {
            const data: CharacterData = JSON.parse(raw);
            return data.Name;
          } catch (e) {
            console.warn("Failed to parse:", key.name);
          }
        }
        return null;
      })
    );
    names.push(...values.filter((v): v is string => v !== null));

    if (names.length === 0) {
      console.error("No characters found in KV.");
      return;
    }

    // Create a deterministic shuffle for this cycle
    const shuffled = seededShuffle(names, cycle);
    const selectedKey = shuffled[index];

    const characterData = await kv.get(selectedKey);
    if (!characterData) {
      console.error(`Character data missing for key: ${selectedKey}`);
      return;
    }

    // Write the today from before to previous character
    const previousCharacter = await kv.get("character:today");
    await kv.put("character:previous", previousCharacter || "");
    // Store today's selected character under a shared key
    await kv.put("character:today", characterData);

    // Update rotation index / cycle
    index++;
    if (index >= shuffled.length) {
      index = 0;
      cycle++;
    }

    await Promise.all([
      kv.put("rotationIndex", index.toString()),
      kv.put("rotationCycle", cycle.toString())
    ]);

    console.log(`Selected ${selectedKey} as today's character.`);
  },
};