export default async function(counterWS: string) {
  console.log('Fetching counter from Durable Object...');
  const countRes = await fetch(`${counterWS}/classic`);
  const countJson = await countRes.json();
  return countJson;
}