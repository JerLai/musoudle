export function getCurrentUTCDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function msUntilNextUTCMidnight(): number {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next.getTime() - now.getTime();
}
