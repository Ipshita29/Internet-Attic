import { hashString } from './colors';

const SCHEMES = [
  ['#DDBBB3', '#F3E1DC', '#B97758'],
  ['#DCD4E8', '#EFEAF6', '#8070A6'],
  ['#D9E0CA', '#EEF2E3', '#798568'],
  ['#E8CF91', '#F6EAC6', '#B8892D'],
  ['#C9D8DE', '#E6EEF1', '#5F8794'],
  ['#E4B79B', '#F5DDCB', '#B97758'],
];

function svgToUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Deterministic illustrated placeholder, so every card has a pleasant cover without network access. */
export function makeThumbnail(seedText, label = '') {
  const h = hashString(seedText || 'attic');
  const [a, b, c] = SCHEMES[h % SCHEMES.length];
  const initial = (label || seedText || 'a').replace(/[^a-z0-9]/gi, '').charAt(0).toUpperCase() || 'A';
  const shapes = [];
  for (let i = 0; i < 4; i += 1) {
    const x = (hashString(`${seedText}x${i}`) % 320) + 10;
    const y = (hashString(`${seedText}y${i}`) % 160) + 10;
    const r = (hashString(`${seedText}r${i}`) % 40) + 22;
    shapes.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? b : c}" opacity="${i % 2 ? 0.55 : 0.22}"/>`);
  }
  const variant = h % 3;
  const deco =
    variant === 0
      ? `<rect x="44" y="34" width="112" height="14" rx="7" fill="#FFFAF1" opacity=".8"/><rect x="44" y="58" width="76" height="9" rx="4.5" fill="#FFFAF1" opacity=".6"/><rect x="44" y="76" width="92" height="9" rx="4.5" fill="#FFFAF1" opacity=".5"/>`
      : variant === 1
        ? `<path d="M0 150 Q80 110 160 140 T340 120 V190 H0Z" fill="#FFFAF1" opacity=".45"/><path d="M0 165 Q90 135 180 160 T340 150 V190 H0Z" fill="#FFFAF1" opacity=".5"/>`
        : `<rect x="236" y="30" width="70" height="90" rx="10" fill="#FFFAF1" opacity=".55" transform="rotate(8 270 75)"/><rect x="214" y="44" width="70" height="90" rx="10" fill="#FFFAF1" opacity=".7" transform="rotate(-6 250 90)"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 190" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="340" height="190" fill="url(#g)"/>${shapes.join('')}${deco}<text x="${variant === 0 ? 270 : 56}" y="${variant === 0 ? 150 : 120}" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="700" fill="${c}" opacity=".85">${initial}</text></svg>`;
  return svgToUri(svg);
}

export function makeFavicon(domain) {
  const h = hashString(domain || 'x');
  const [a, , c] = SCHEMES[h % SCHEMES.length];
  const letter = (domain || '?').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${a}"/><text x="16" y="22.5" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="700" fill="${c}">${letter}</text></svg>`;
  return svgToUri(svg);
}
