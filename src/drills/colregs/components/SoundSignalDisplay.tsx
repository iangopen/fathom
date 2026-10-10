import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { SvgA11y, imgProps, countWord } from '../../../lib/visualA11y';

// 'stroke' is one separate stroke on the bell - Rule 35(h)'s three strokes
// before and after the rapid ringing of a vessel aground.
export type BlastMark = 'short' | 'prolonged' | 'bell' | 'stroke';

interface SoundSignalDisplayProps {
  sequence: BlastMark[];
  label?: string;
  // Silence between blasts, in seconds. Defaults to GAP_S; Rule 35(b) sets its
  // own interval, so that signal passes an override rather than reusing this.
  gapS?: number;
  a11y?: SvgA11y;
}

// Rule 32 durations, in seconds.
const SHORT_S = 1;
const PROLONGED_S = 5;   // rule says 4-6 seconds
const GAP_S = 1;         // silence between blasts
const BELL_S = 5;        // Rule 35(g): rapid ringing for about 5 seconds
const BELL_STRIKE_INTERVAL = 0.2;
const STROKE_S = 0.6;     // one distinct stroke, left to ring before the next

// --- Diagram geometry ---
// Same near-black-on-slate language as LightDisplay / DayShapeDisplay;
// mark widths are proportional to blast duration.
const MARK_FILL = 'rgb(9,13,24)';
const MARK_STROKE = 'rgba(203,213,225,0.75)';
const MARK_STROKE_W = 1.1;

const MARK_H = 16;
const SHORT_W = 16;
const PROLONGED_W = 62;
const BELL_W = 62;
const STROKE_W = 4;
const GAP_PX = 14;
const PAD_X = 14;
const MIN_W = 212;
const AXIS_Y = 46;
const VIEW_H = 74;

function markWidth(mark: BlastMark): number {
  if (mark === 'short') return SHORT_W;
  if (mark === 'prolonged') return PROLONGED_W;
  if (mark === 'stroke') return STROKE_W;
  return BELL_W;
}

// ── The text equivalent ──────────────────────────────────────────────────
//
// Generated from the sequence and gap the diagram is laid out from: the marks
// left to right, runs of the same mark counted together, a gap that is not
// the usual one, and the legend - which the diagram prints, and only for the
// marks it contains. It never says what the signal means.
const MARK_WORDS: Record<BlastMark, [string, string]> = {
  short: ['short blast', 'short blasts'],
  prolonged: ['prolonged blast', 'prolonged blasts'],
  bell: ['rapid ringing of the bell', 'rapid ringings of the bell'],
  stroke: ['stroke on the bell', 'strokes on the bell'],
};

export function describeSoundSignal(sequence: BlastMark[], gapS: number = GAP_S): string {
  const runs: { mark: BlastMark; n: number }[] = [];
  for (const mark of sequence) {
    const last = runs[runs.length - 1];
    if (last && last.mark === mark) last.n += 1;
    else runs.push({ mark, n: 1 });
  }
  const phrases = runs.map(({ mark, n }) => `${countWord(n)} ${MARK_WORDS[mark][n === 1 ? 0 : 1]}`);
  const order = phrases.length === 1 ? phrases[0] : `${phrases.slice(0, -1).join(', then ')}, then ${phrases[phrases.length - 1]}`;
  const gap = gapS !== GAP_S ? `, with a gap of about ${gapS} seconds between them` : '';

  // The legend as printed, and only the entries the diagram prints for it.
  const key: string[] = [];
  if (sequence.includes('short')) key.push(`short blast, ${SHORT_S} second`);
  if (sequence.includes('prolonged')) key.push('prolonged blast, 4 to 6 seconds');
  if (sequence.includes('bell')) key.push(`rapid ringing, ${BELL_S} seconds`);
  if (sequence.includes('stroke')) key.push('one stroke, a single upright tick');

  return (
    `Marks along a time line, read left to right: ${order}${gap}. ` +
    `Key: ${key.join('; ')}. A Play button below sounds the signal.`
  );
}

export const SoundSignalDisplay: React.FC<SoundSignalDisplayProps> = ({
  sequence,
  label,
  gapS = GAP_S,
  a11y,
}) => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<number | null>(null);

  // Keep the drawn gap proportional to the played one, so a longer interval
  // reads as a wider space rather than silently diverging from the audio.
  const gapPx = GAP_PX * (gapS / GAP_S);

  // Lay the marks out left to right with a consistent gap, centred in the view.
  const widths = sequence.map(markWidth);
  const marksW = widths.reduce((a, b) => a + b, 0) + gapPx * Math.max(0, sequence.length - 1);
  const totalW = Math.max(marksW + PAD_X * 2, MIN_W);

  let cursor = (totalW - marksW) / 2;
  const placed = sequence.map((mark, i) => {
    const x = cursor;
    cursor += widths[i] + gapPx;
    return { mark, x, w: widths[i] };
  });

  const hasShort = sequence.includes('short');
  const hasProlonged = sequence.includes('prolonged');
  const hasBell = sequence.includes('bell');
  const hasStroke = sequence.includes('stroke');

  // --- Audio ---

  const stopPlayback = useCallback(() => {
    if (stopRef.current !== null) {
      clearTimeout(stopRef.current);
      stopRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => { /* already closed */ });
      ctxRef.current = null;
    }
    setPlaying(false);
  }, []);

  useEffect(() => stopPlayback, [stopPlayback]);

  // One horn blast: low sawtooth plus a sub-octave square through a lowpass,
  // with a soft attack/release so it reads as a horn rather than a click.
  const scheduleHorn = (ctx: AudioContext, start: number, duration: number) => {
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = 165;
    sub.type = 'square';
    sub.frequency.value = 82.5;

    filter.type = 'lowpass';
    filter.frequency.value = 900;

    const attack = 0.04;
    const release = 0.08;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.28, start + attack);
    gain.gain.setValueAtTime(0.28, start + duration - release);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    sub.start(start);
    osc.stop(start + duration + 0.02);
    sub.stop(start + duration + 0.02);
  };

  // One bell strike - the same voice as the rapid ringing, so the strokes
  // read as the same bell.
  const scheduleStrike = (ctx: AudioContext, t: number, length: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 2100;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length * 0.85);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + length);
  };

  // Rapid ringing of a bell for about 5 seconds.
  const scheduleBell = (ctx: AudioContext, start: number) => {
    const strikes = Math.round(BELL_S / BELL_STRIKE_INTERVAL);
    for (let i = 0; i < strikes; i++) {
      scheduleStrike(ctx, start + i * BELL_STRIKE_INTERVAL, BELL_STRIKE_INTERVAL);
    }
    return start + BELL_S;
  };

  // Audio is created and started only inside this click handler - never on
  // mount - so the browser autoplay policy is satisfied.
  const handlePlay = () => {
    if (playing) return;

    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    ctxRef.current = ctx;

    let t = ctx.currentTime + 0.08;
    sequence.forEach((mark, i) => {
      if (mark === 'bell') {
        t = scheduleBell(ctx, t);
      } else if (mark === 'stroke') {
        scheduleStrike(ctx, t, STROKE_S);
        t += STROKE_S;
      } else {
        const duration = mark === 'short' ? SHORT_S : PROLONGED_S;
        scheduleHorn(ctx, t, duration);
        t += duration;
      }
      if (i < sequence.length - 1) t += gapS;
    });

    const totalMs = (t - ctx.currentTime) * 1000;
    setPlaying(true);
    stopRef.current = window.setTimeout(stopPlayback, totalMs + 200);
  };

  const legendProlongedX = hasShort ? PAD_X + 84 : PAD_X;

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
      )}

      <div className="w-full max-w-[220px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
        <svg
          viewBox={`0 0 ${totalW} ${VIEW_H}`}
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          {...imgProps(a11y)}
        >
          {/* Time axis */}
          <line
            x1={4} y1={AXIS_Y + MARK_H / 2 + 8}
            x2={totalW - 4} y2={AXIS_Y + MARK_H / 2 + 8}
            stroke="rgba(148,163,184,0.2)"
            strokeWidth="0.8"
          />

          {/* Blast marks */}
          {placed.map(({ mark, x, w }, i) => {
            if (mark === 'stroke') {
              // One distinct stroke: a single tick, the same as one of the
              // rapid ringing's, standing on its own.
              return (
                <rect
                  key={`mark-${i}`}
                  x={x + (w - 3.2) / 2}
                  y={AXIS_Y - MARK_H / 2}
                  width={3.2}
                  height={MARK_H}
                  rx={1.4}
                  fill={MARK_FILL}
                  stroke={MARK_STROKE}
                  strokeWidth={0.7}
                />
              );
            }
            if (mark === 'bell') {
              // Rapid ringing: a run of closely spaced ticks, not one blast.
              const ticks = 9;
              const step = w / (ticks - 1);
              return (
                <g key={`mark-${i}`}>
                  {Array.from({ length: ticks }, (_, k) => (
                    <rect
                      key={k}
                      x={x + k * step - 1.6}
                      y={AXIS_Y - MARK_H / 2}
                      width={3.2}
                      height={MARK_H}
                      rx={1.4}
                      fill={MARK_FILL}
                      stroke={MARK_STROKE}
                      strokeWidth={0.7}
                    />
                  ))}
                </g>
              );
            }
            return (
              <rect
                key={`mark-${i}`}
                x={x}
                y={AXIS_Y - MARK_H / 2}
                width={w}
                height={MARK_H}
                rx={MARK_H / 2}
                fill={MARK_FILL}
                stroke={MARK_STROKE}
                strokeWidth={MARK_STROKE_W}
              />
            );
          })}

          {/* Legend - stated once for the whole diagram, not per mark */}
          <g fontFamily="monospace" fontSize="7" fill="rgba(148,163,184,0.65)">
            {hasShort && (
              <>
                <rect x={PAD_X} y={12} width={SHORT_W} height={7} rx={3.5} fill={MARK_FILL} stroke={MARK_STROKE} strokeWidth={0.7} />
                <text x={PAD_X + SHORT_W + 6} y={18}>short 1s</text>
              </>
            )}
            {hasProlonged && (
              <>
                <rect x={legendProlongedX} y={12} width={26} height={7} rx={3.5} fill={MARK_FILL} stroke={MARK_STROKE} strokeWidth={0.7} />
                <text x={legendProlongedX + 32} y={18}>prolonged 4-6s</text>
              </>
            )}
            {hasBell && <text x={PAD_X} y={18}>rapid bell 5s</text>}
            {hasStroke && <text x={hasBell ? PAD_X + 84 : PAD_X} y={18}>| one stroke</text>}
          </g>

          <text
            x={totalW / 2} y={VIEW_H - 4}
            textAnchor="middle"
            fontFamily="monospace" fontSize="7"
            fill="rgba(148,163,184,0.35)"
          >
            TIME
          </text>
        </svg>

        <button
          type="button"
          onClick={handlePlay}
          disabled={playing}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-mono uppercase tracking-wider text-slate-300 hover:bg-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 size={14} />
          {playing ? 'Playing' : 'Play'}
        </button>
      </div>
    </div>
  );
};
