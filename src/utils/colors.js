export const PASTELS = [
  { name: 'Rose', value: '#DDBBB3' },
  { name: 'Lavender', value: '#DCD4E8' },
  { name: 'Sage', value: '#D9E0CA' },
  { name: 'Honey', value: '#E8CF91' },
  { name: 'Clay', value: '#E4B79B' },
  { name: 'Sky', value: '#C9D8DE' },
];

const TAG_TONES = [
  { bg: '#E8D2CC', fg: '#7A4A3A' },
  { bg: '#E3DDEE', fg: '#5B4C7A' },
  { bg: '#DFE6D1', fg: '#55633F' },
  { bg: '#F2E3B8', fg: '#7A6020' },
  { bg: '#EBCDB8', fg: '#7F4A2C' },
  { bg: '#D5E2E7', fg: '#3F6270' },
];

export function hashString(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

export function tagTone(tag) {
  return TAG_TONES[hashString(String(tag).toLowerCase()) % TAG_TONES.length];
}
