/* Hand-drawn style SVG illustrations. Ink lines, soft pastel fills. */
const INK = '#44392F';
const line = { stroke: INK, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const C = {
  parchment: '#F5EFE3', card: '#FFFAF1', sage: '#798568', sageLight: '#D9E0CA', terracotta: '#B97758',
  rose: '#DDBBB3', lavender: '#DCD4E8', honey: '#E8CF91', clay: '#E4B79B', wood: '#C99B73',
};

/** Wraps a bare ornament (Sparkle, Leaf, Plant...) in its own SVG so it can sit in HTML. */
export function Ornament({ children, box = '-16 -30 32 60', width = 32, height = 60 }) {
  return (
    <svg viewBox={box} width={width} height={height} aria-hidden="true" style={{ overflow: 'visible' }}>
      {children}
    </svg>
  );
}

export function Sparkle({ x = 0, y = 0, s = 1, fill = C.honey }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-9C1.2-3 3-1.2 9 0 3 1.2 1.2 3 0 9-1.2 3-3 1.2-9 0-3-1.2-1.2-3 0-9Z" fill={fill} {...line} strokeWidth={1.6 / s} />;
}

export function Leaf({ x = 0, y = 0, r = 0, s = 1, fill = C.sage }) {
  return <path transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d="M0 0C-8-6-8-18 0-24 8-18 8-6 0 0ZM0 0V-20" fill={fill} {...line} strokeWidth={1.8 / s} />;
}

export function Flower({ x = 0, y = 0, s = 1, petal = C.rose }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-6" rx="4.5" ry="6.5" fill={petal} transform={`rotate(${a})`} {...line} strokeWidth={1.6 / s} />
      ))}
      <circle r="3.4" fill={C.honey} {...line} strokeWidth={1.6 / s} />
    </g>
  );
}

export function Star({ x = 0, y = 0, s = 1, fill = C.honey }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-9 2.6-3 9-2.4 4.2 1.8 5.6 8 0 4.8-5.6 8-4.2 1.8-9-2.4-2.6-3Z" fill={fill} {...line} strokeWidth={1.6 / s} />;
}

export function Plant({ x = 0, y = 0, s = 1, pot = C.terracotta }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0-4C-18-18-20-38-8-46 0-34 2-18 0-4Z" fill={C.sage} {...line} />
      <path d="M2-4C18-14 26-34 16-46 4-36 0-20 2-4Z" fill="#92A07F" {...line} />
      <path d="M0-4C-4-28-2-44 0-58 6-44 6-28 0-4Z" fill={C.sage} {...line} />
      <path d="M-16-4H18L14 22H-12Z" fill={pot} {...line} />
      <path d="M-18-6H20V0H-18Z" fill="#C98C6C" {...line} />
    </g>
  );
}

export function Lamp({ x = 0, y = 0, s = 1, shade = C.honey, glow = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && <ellipse cx="0" cy="-8" rx="34" ry="26" fill={C.honey} opacity=".28" />}
      <path d="M-16-44H16L24-18H-24Z" fill={shade} {...line} />
      <path d="M0-18V30" {...line} />
      <path d="M-14 32Q0 24 14 32Z" fill={C.wood} {...line} />
    </g>
  );
}

export function BookStack({ x = 0, y = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-26" y="-8" width="52" height="12" rx="3" fill={C.terracotta} {...line} />
      <path d="M-18-4H18" stroke={C.card} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="-22" y="-20" width="44" height="12" rx="3" fill={C.sage} {...line} />
      <path d="M-14-14H14" stroke={C.card} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="-18" y="-32" width="38" height="12" rx="3" fill={C.lavender} transform="rotate(-3)" {...line} />
    </g>
  );
}

export function House({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 32 32 11l24 21" fill="none" stroke={C.terracotta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 30v24h36V30" fill={C.honey} {...line} strokeWidth="2.6" />
      <rect x="40" y="14" width="6" height="12" rx="1.5" fill={C.rose} {...line} strokeWidth="2.2" />
      <circle cx="32" cy="28" r="5.5" fill={C.card} {...line} strokeWidth="2.2" />
      <path d="M29 28h6M32 25v6" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M26 54V43a6 6 0 0 1 12 0v11" fill={C.sage} {...line} strokeWidth="2.4" />
      <circle cx="35" cy="48" r="1" fill={C.card} />
      <Sparkle x={54} y={12} s={0.55} />
    </svg>
  );
}

export function CatOnBooks({ width = 150 }) {
  return (
    <svg width={width} viewBox="0 0 170 100" aria-hidden="true" className="cat-books">
      <rect x="14" y="76" width="130" height="16" rx="4" fill={C.sage} {...line} />
      <path d="M26 84H132" stroke={C.card} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="26" y="62" width="112" height="15" rx="4" fill={C.terracotta} {...line} />
      <path d="M38 69.5H124" stroke={C.card} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="34" y="49" width="94" height="14" rx="4" fill={C.lavender} {...line} />
      <path d="M44 56H118" stroke={C.card} strokeWidth="1.8" strokeLinecap="round" />
      <g className="cat-body">
        <path d="M40 50C40 28 62 20 86 22 112 24 126 36 124 50Z" fill="#E5B98F" {...line} />
        <path d="M56 36C62 30 70 28 78 28" stroke="#C98C6C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M84 24c6-2 12 0 16 5" stroke="#C98C6C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M40 46C28 44 22 36 26 28" fill="none" {...line} strokeWidth="5" stroke="#E5B98F" />
        <path d="M40 46C28 44 22 36 26 28" fill="none" {...line} />
        <path d="M112 42c8-2 14 0 16 4" fill="none" stroke="#C98C6C" strokeWidth="2" strokeLinecap="round" />
        <path d="M118 28 114 16 124 22Z M132 30 140 20 138 34Z" fill="#E5B98F" {...line} />
        <path d="M110 40Q122 46 136 38" fill="none" {...line} strokeWidth="1.6" />
        <path d="M118 36q2 2 4 0M128 35q2 2 4 0" fill="none" {...line} strokeWidth="1.6" />
      </g>
      <text className="cat-z" x="142" y="18" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="700" fill={C.sage}>z</text>
      <text className="cat-z cat-z-2" x="152" y="8" fontFamily="Fraunces, Georgia, serif" fontSize="9" fontWeight="700" fill={C.sage}>z</text>
    </svg>
  );
}

/* ---------- Room scenes ---------- */

function Scene({ bg, children, label }) {
  return (
    <svg viewBox="0 0 240 170" role="img" aria-label={label} className="scene" preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="170" fill={bg} />
      {children}
    </svg>
  );
}

function NookScene() {
  return (
    <Scene bg="#EBD3CC" label="A reading nook with an armchair and lamp">
      <circle cx="120" cy="64" r="46" fill="#F5E3DD" />
      <path d="M0 132H240V170H0Z" fill="#D8B0A6" />
      <path d="M0 132H240" {...line} />
      <path d="M62 110C62 86 90 82 112 82s46 6 46 28v22H62Z" fill={C.terracotta} {...line} />
      <rect x="54" y="104" width="22" height="30" rx="10" fill="#A8654A" {...line} />
      <rect x="148" y="104" width="22" height="30" rx="10" fill="#A8654A" {...line} />
      <path d="M78 112h66v20H78Z" fill="#C98C6C" {...line} />
      <path d="M72 96c6-8 14-10 22-10" stroke="#F5E3DD" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Lamp x={196} y={96} s={0.9} />
      <BookStack x={34} y={130} s={0.9} />
      <Plant x={212} y={150} s={0.55} />
      <rect x="86" y="30" width="54" height="40" rx="6" fill={C.card} {...line} />
      <path d="M113 30v40M86 50h54" {...line} strokeWidth="1.6" />
      <Sparkle x={24} y={36} s={0.8} />
      <Star x={196} y={36} s={0.7} />
      <Leaf x={170} y={34} r={30} s={0.55} />
    </Scene>
  );
}

function WallScene() {
  return (
    <Scene bg="#E4DDEE" label="An inspiration wall with pinned frames">
      <path d="M0 140H240V170H0Z" fill="#CBC0DC" />
      <path d="M0 140H240" {...line} />
      <path d="M16 20 70 36 120 22 170 38 224 20" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      {[[34, '#E8CF91'], [86, '#DDBBB3'], [132, '#D9E0CA'], [186, '#F5EFE3']].map(([x, c], i) => (
        <path key={x} d={`M${x - 8} ${28 + (i % 2) * 6}h16l-8 18Z`} fill={c} {...line} strokeWidth="1.8" />
      ))}
      <g transform="rotate(-4 60 84)"><rect x="30" y="56" width="62" height="56" rx="4" fill={C.card} {...line} /><rect x="38" y="64" width="46" height="30" rx="2" fill={C.honey} stroke={INK} strokeWidth="1.6" /><circle cx="52" cy="74" r="5" fill={C.card} /><path d="M38 94l14-12 12 8 8-6 12 10" fill={C.terracotta} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /><path d="M38 102h30M38 107h20" stroke={INK} strokeWidth="1.8" strokeLinecap="round" /><circle cx="61" cy="56" r="3.2" fill={C.terracotta} {...line} strokeWidth="1.6" /></g>
      <g transform="rotate(3 140 84)"><rect x="110" y="48" width="52" height="72" rx="4" fill={C.card} {...line} /><rect x="118" y="56" width="36" height="38" rx="2" fill={C.sageLight} stroke={INK} strokeWidth="1.6" /><path d="M118 94 132 74l22 20Z" fill={C.sage} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /><path d="M118 104h36M118 110h24" stroke={INK} strokeWidth="1.8" strokeLinecap="round" /><circle cx="136" cy="48" r="3.2" fill={C.sage} {...line} strokeWidth="1.6" /></g>
      <g transform="rotate(6 192 100)"><rect x="170" y="78" width="44" height="44" rx="4" fill={C.card} {...line} /><circle cx="192" cy="100" r="13" fill={C.rose} stroke={INK} strokeWidth="1.6" /><Flower x={192} y={100} s={0.9} petal={C.lavender} /><circle cx="192" cy="78" r="3" fill={C.honey} {...line} strokeWidth="1.6" /></g>
      <Plant x={20} y={156} s={0.5} />
      <Sparkle x={222} y={60} s={0.7} />
      <Star x={14} y={72} s={0.6} />
    </Scene>
  );
}

function WorkshopScene() {
  return (
    <Scene bg="#DCE4CE" label="A workshop with a desk, monitor and shelf">
      <rect x="20" y="28" width="80" height="6" rx="2" fill={C.wood} {...line} />
      <rect x="30" y="12" width="14" height="16" rx="3" fill={C.card} {...line} />
      <rect x="50" y="8" width="14" height="20" rx="3" fill={C.rose} {...line} />
      <rect x="70" y="14" width="22" height="14" rx="3" fill={C.lavender} {...line} />
      <rect x="0" y="122" width="240" height="48" fill="#C7D1B4" />
      <path d="M0 122H240" {...line} />
      <rect x="36" y="112" width="168" height="10" rx="3" fill={C.wood} {...line} />
      <path d="M48 122v36M192 122v36" {...line} strokeWidth="3" />
      <rect x="82" y="58" width="76" height="48" rx="6" fill={C.card} {...line} />
      <rect x="88" y="64" width="64" height="34" rx="3" fill="#44392F" />
      <path d="M102 74 94 81l8 7M138 74l8 7-8 7M124 70l-8 22" stroke={C.honey} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M120 106v6M104 112h32" {...line} />
      <rect x="168" y="98" width="16" height="14" rx="3" fill={C.card} {...line} />
      <path d="M184 102c6 0 6 8 0 8" fill="none" {...line} strokeWidth="1.8" />
      <path d="M172 94c-2-4 2-6 0-10M178 94c-2-4 2-6 0-10" stroke={C.sage} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <Plant x={60} y={110} s={0.5} />
      <g transform="translate(196 52)"><circle r="14" fill={C.honey} {...line} /><circle r="5" fill={C.card} {...line} strokeWidth="1.8" />{[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x="-3" y="-20" width="6" height="8" rx="1.5" fill={C.honey} {...line} strokeWidth="1.8" transform={`rotate(${a})`} />)}</g>
      <Sparkle x={216} y={96} s={0.6} />
    </Scene>
  );
}

function LaterScene() {
  return (
    <Scene bg="#F2E4BA" label="A wooden crate filled with papers and a bookmark">
      <circle cx="176" cy="46" r="24" fill={C.card} {...line} />
      <path d="M176 32v14l9 6" fill="none" {...line} />
      <path d="M0 136H240V170H0Z" fill="#E3CF93" />
      <path d="M0 136H240" {...line} />
      <g transform="rotate(-6 80 80)"><rect x="52" y="30" width="46" height="58" rx="3" fill={C.card} {...line} /><path d="M60 42h30M60 50h24M60 58h28" stroke={INK} strokeWidth="1.8" strokeLinecap="round" /></g>
      <g transform="rotate(5 110 76)"><rect x="92" y="26" width="46" height="62" rx="3" fill={C.lavender} {...line} /><path d="M100 40h30M100 48h20" stroke={INK} strokeWidth="1.8" strokeLinecap="round" /></g>
      <path d="M126 20h22v50l-11-9-11 9Z" fill={C.terracotta} {...line} />
      <path d="M44 84H170V140H44Z" fill={C.wood} {...line} />
      <path d="M44 100H170M44 120H170" {...line} strokeWidth="1.6" />
      <rect x="92" y="94" width="30" height="16" rx="4" fill={C.card} {...line} strokeWidth="1.8" />
      <path d="M100 102h14" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <Plant x={200} y={150} s={0.6} />
      <Sparkle x={26} y={50} s={0.8} />
      <Star x={30} y={96} s={0.6} />
    </Scene>
  );
}

/* ---------- Generic covers for custom rooms ---------- */

function PlantScene() {
  return (
    <Scene bg="#DCE4CE" label="A potted plant">
      <path d="M0 140H240V170H0Z" fill="#C7D1B4" />
      <path d="M0 140H240" {...line} />
      <Plant x={120} y={118} s={1.9} />
      <Sparkle x={40} y={44} s={0.9} />
      <Leaf x={200} y={70} r={20} s={0.9} />
      <Star x={196} y={36} s={0.7} />
    </Scene>
  );
}
function LampScene() {
  return (
    <Scene bg="#F2E4BA" label="A glowing lamp">
      <path d="M0 140H240V170H0Z" fill="#E3CF93" />
      <path d="M0 140H240" {...line} />
      <circle cx="120" cy="76" r="62" fill={C.card} opacity=".5" />
      <Lamp x={120} y={110} s={1.8} />
      <Sparkle x={52} y={50} s={0.9} />
      <Sparkle x={196} y={64} s={0.7} />
    </Scene>
  );
}
function BoxScene() {
  return (
    <Scene bg="#EBD3CC" label="A treasure box">
      <path d="M0 140H240V170H0Z" fill="#D8B0A6" />
      <path d="M0 140H240" {...line} />
      <path d="M68 76H172V138H68Z" fill={C.wood} {...line} />
      <path d="M68 76Q70 46 120 44t52 32Z" fill={C.terracotta} {...line} />
      <path d="M68 96H172" {...line} strokeWidth="1.8" />
      <rect x="108" y="82" width="24" height="26" rx="5" fill={C.honey} {...line} />
      <circle cx="120" cy="94" r="3.4" fill={INK} />
      <Sparkle x={52} y={50} s={0.9} />
      <Star x={190} y={46} s={0.8} />
      <Flower x={196} y={126} s={0.9} petal={C.card} />
    </Scene>
  );
}
function BooksScene() {
  return (
    <Scene bg="#E4DDEE" label="A stack of books">
      <path d="M0 140H240V170H0Z" fill="#CBC0DC" />
      <path d="M0 140H240" {...line} />
      <BookStack x={120} y={138} s={2.3} />
      <Sparkle x={48} y={48} s={0.9} />
      <Flower x={196} y={126} s={0.9} petal={C.honey} />
    </Scene>
  );
}
function ShelfScene() {
  return (
    <Scene bg="#E8DFC8" label="A little shelf">
      <rect x="44" y="40" width="152" height="8" rx="2" fill={C.wood} {...line} />
      <rect x="44" y="96" width="152" height="8" rx="2" fill={C.wood} {...line} />
      <rect x="54" y="14" width="12" height="26" rx="2" fill={C.sage} {...line} />
      <rect x="68" y="18" width="10" height="22" rx="2" fill={C.rose} {...line} />
      <rect x="80" y="12" width="14" height="28" rx="2" fill={C.honey} {...line} />
      <Plant x={160} y={40} s={0.6} />
      <rect x="58" y="72" width="30" height="24" rx="4" fill={C.card} {...line} />
      <Lamp x={140} y={96} s={0.5} glow={false} />
      <Plant x={176} y={96} s={0.5} pot={C.rose} />
      <path d="M0 150H240" {...line} />
      <Sparkle x={216} y={30} s={0.7} />
    </Scene>
  );
}
function CatScene() {
  return (
    <Scene bg="#F2E4BA" label="A sleepy cat on books">
      <path d="M0 146H240V170H0Z" fill="#E3CF93" />
      <path d="M0 146H240" {...line} />
      <g transform="translate(34 0) scale(1.1)"><CatOnBooksInner /></g>
      <Star x={198} y={36} s={0.8} />
    </Scene>
  );
}
function CatOnBooksInner() {
  return (
    <g transform="translate(0 20)">
      <rect x="14" y="76" width="130" height="16" rx="4" fill={C.sage} {...line} />
      <rect x="26" y="62" width="112" height="15" rx="4" fill={C.terracotta} {...line} />
      <path d="M40 50C40 28 62 20 86 22 112 24 126 36 124 50Z" fill="#E5B98F" {...line} />
      <path d="M118 28 114 16 124 22Z M132 30 140 20 138 34Z" fill="#E5B98F" {...line} />
      <path d="M118 36q2 2 4 0M128 35q2 2 4 0" fill="none" {...line} strokeWidth="1.6" />
    </g>
  );
}

const COVERS = {
  nook: NookScene, wall: WallScene, workshop: WorkshopScene, later: LaterScene,
  plant: PlantScene, lamp: LampScene, box: BoxScene, books: BooksScene, shelf: ShelfScene, cat: CatScene,
};

export const COVER_OPTIONS = [
  { value: 'plant', label: 'Plant' }, { value: 'lamp', label: 'Lamp' }, { value: 'box', label: 'Treasure box' },
  { value: 'books', label: 'Books' }, { value: 'shelf', label: 'Shelf' }, { value: 'cat', label: 'Sleepy cat' },
  { value: 'nook', label: 'Nook' }, { value: 'wall', label: 'Wall' }, { value: 'workshop', label: 'Workshop' }, { value: 'later', label: 'Crate' },
];

export function RoomIllustration({ cover }) {
  const Cmp = COVERS[cover] || PlantScene;
  return <Cmp />;
}

/** Small illustration used in empty states. */
export function EmptyIllustration({ kind = 'box' }) {
  return (
    <svg viewBox="0 0 160 120" width="160" height="120" aria-hidden="true" className="empty-illustration">
      <ellipse cx="80" cy="106" rx="56" ry="6" fill="#E2D5C2" />
      {kind === 'search' ? (
        <g>
          <circle cx="72" cy="56" r="30" fill={C.card} {...line} />
          <circle cx="72" cy="56" r="22" fill={C.lavender} opacity=".55" />
          <path d="M94 78 118 102" {...line} strokeWidth="6" />
          <path d="M62 52h4M80 52h4M64 66q8-6 16 0" fill="none" {...line} strokeWidth="2" />
        </g>
      ) : (
        <g>
          <path d="M38 58H122V98H38Z" fill={C.wood} {...line} strokeDasharray="0" />
          <path d="M38 72H122" {...line} strokeWidth="1.8" />
          <path d="M38 58 30 40 130 40 122 58Z" fill={C.terracotta} {...line} transform="rotate(-6 80 50)" />
          <rect x="70" y="62" width="20" height="18" rx="4" fill={C.honey} {...line} />
          <circle cx="80" cy="70" r="2.4" fill={INK} />
        </g>
      )}
      <Sparkle x={24} y={30} s={0.9} />
      <Star x={140} y={24} s={0.8} fill={C.rose} />
      <Leaf x={134} y={100} r={20} s={0.6} />
    </svg>
  );
}
