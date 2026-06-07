// Palette shared between the 3D scene and the DOM chrome.
export const COLORS = {
  bg: '#08090d',
  gold: '#f0b454', // read papers — warm
  goldDim: '#8a6a32',
  slate: '#566072', // queued / unread — cool
  slateDim: '#2f3540',
  edgeGold: '#caa15a',
  edgeGray: '#3a3f4a',
  text: '#e7e4dc',
  textMuted: 'rgba(231,228,220,0.55)',
} as const;

export function nodeColor(read: boolean): string {
  return read ? COLORS.gold : COLORS.slate;
}
