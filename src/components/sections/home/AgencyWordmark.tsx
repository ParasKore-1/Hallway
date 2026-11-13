import type { Agency } from '@/content/home';

export interface AgencyWordmarkProps {
  agency: Agency;
}

const glyphs: Record<Agency['glyph'], string> = {
  arch: 'M2 22V10a8 8 0 0 1 16 0v12z',
  circle: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  diamond: 'M10 1l9 9-9 9-9-9z',
  leaf: 'M3 19C3 9 9 3 19 3c0 10-6 16-16 16zm0 0L12 10',
  bars: 'M3 4h3v14H3zM8.5 7h3v11h-3zM14 10h3v8h-3z',
  key: 'M7 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm4.5 6.5H19v3h-2v2h-3v-2h-2.5',
};

const fontStyle: Record<
  Agency['style'],
  { family: string; weight: number; italic: boolean; tracking: number }
> = {
  serif: { family: 'var(--hw-font-display)', weight: 500, italic: false, tracking: -0.2 },
  caps: { family: 'var(--hw-font-sans)', weight: 700, italic: false, tracking: 2.2 },
  mono: { family: 'var(--hw-font-mono)', weight: 500, italic: false, tracking: -0.4 },
  italic: { family: 'var(--hw-font-display)', weight: 400, italic: true, tracking: 0 },
};

/** Simple original SVG wordmark for a fictional agency. */
export function AgencyWordmark({ agency }: AgencyWordmarkProps) {
  const style = fontStyle[agency.style];
  const charWidth = agency.style === 'caps' ? 13.4 : agency.style === 'mono' ? 11.4 : 11.6;
  const width = Math.round(30 + agency.name.length * charWidth);
  return (
    <svg
      role="img"
      aria-label={agency.name}
      viewBox={`0 0 ${width} 24`}
      width={width}
      height={24}
      className="h-6 w-auto text-ink-muted"
    >
      <path d={glyphs[agency.glyph]} fill="currentColor" fillRule="evenodd" />
      <text
        x="28"
        y="18"
        fill="currentColor"
        fontFamily={style.family}
        fontWeight={style.weight}
        fontStyle={style.italic ? 'italic' : 'normal'}
        fontSize={agency.style === 'caps' ? 15 : 19}
        letterSpacing={style.tracking}
      >
        {agency.name}
      </text>
    </svg>
  );
}
