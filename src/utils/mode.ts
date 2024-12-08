export function isCryptoMode(mode: any) {
  if (mode === 'crypto') return true;
  if (mode === 'arken') return true;

  return false;
}
