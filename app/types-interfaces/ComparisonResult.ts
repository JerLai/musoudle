export interface ComparisonResult {
  Name: string;
  "Faction(s)": { value:string, match: number };
  "Playable Debut": { value:string, match: number };
  "Weapon Type": { value:string, match: number };
  Born: { value:string, match: number };
  Died: { value:string, match: number };
  Gender: { value:string, match: number };
  Height: { value:string, match: number };
  Hint: { value:string, match: number };
  // Add other properties if needed
}