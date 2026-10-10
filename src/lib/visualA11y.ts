// Text equivalents for the drawn visuals.
//
// THE RULE: a description is generated from the same data that draws the
// picture, by one function per drawing type, and it says what a sighted reader
// sees - positions, colours, shapes, counts, order - and never what it means.
// It must not name the vessel, the flag's letter, the part, or anything else
// the question asks for: a description can leak the answer exactly as a label
// can. The guard is the description block in src/__tests__/answerA11y.test.tsx.
//
// The drawing is exposed as role="img", named for its kind ("Signal flag
// diagram") and described by visually hidden text through aria-describedby, so
// a screen reader reads the description right after the name. The SVG's own
// text (BOW, STERN, a legend) becomes presentational under role="img"; the
// description carries whatever of it matters.

export interface SvgA11y {
  // The accessible name: the kind of visual, never its subject.
  name: string;
  // The id of the element holding the description.
  describedBy: string;
}

// Spread onto the drawing's <svg>. Nothing when there is no description, so a
// drawing used elsewhere without one renders exactly as it always did.
export function imgProps(a11y?: SvgA11y): {
  role?: 'img';
  'aria-label'?: string;
  'aria-describedby'?: string;
} {
  return a11y ? { role: 'img', 'aria-label': a11y.name, 'aria-describedby': a11y.describedBy } : {};
}

// A colour word for a drawn fill, worked out from the colour itself rather
// than looked up in a table of the palettes' hex values: a table would be a
// second copy of every palette, free to drift from the first. Only the plain
// words a viewer would use - the drawings use nothing subtler.
export function colourName(hex: string): string {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) throw new Error(`colourName: not a #rrggbb colour: ${hex}`);
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (l < 0.2) return 'black';
  if (l > 0.85 && s < 0.5) return 'white';
  if (s < 0.15) return 'grey';

  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;

  if (h < 15 || h >= 345) return 'red';
  if (h < 38) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 170) return 'green';
  if (h < 260) return 'blue';
  return 'purple';
}

const NUMBER_WORDS = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
];

export function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

// "a", "a and b", "a, b and c".
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// "one ball", "three balls" - for nouns that take a plain -s.
export function counted(n: number, noun: string): string {
  return `${countWord(n)} ${noun}${n === 1 ? '' : 's'}`;
}
