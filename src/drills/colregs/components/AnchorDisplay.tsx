import React from 'react';

import claw from '../../../assets/anchors/claw.jpg';
import fluke from '../../../assets/anchors/fluke.jpg';
import grapnel from '../../../assets/anchors/grapnel.jpg';
import mushroom from '../../../assets/anchors/mushroom.jpg';
import plow from '../../../assets/anchors/plow.jpg';

export type AnchorTypeName =
  | 'fluke'     // Danforth pattern
  | 'plow'      // CQR / Delta pattern
  | 'claw'      // Bruce pattern
  | 'grapnel'
  | 'mushroom';

interface AnchorDisplayProps {
  type: AnchorTypeName;
  label?: string;
}

// A PHOTOGRAPH of the anchor, not a drawing of one.
//
// This used to be five hand-built SVG silhouettes, and they went through
// several rounds of correction - the fluke's plates, the plow's side
// elevation, the claw's crown, the grapnel's tines - without ever quite
// reading as the real thing. The failure was not in any one path. Five
// anchors that must be told apart by shape are exactly the case where an
// illustration has to be *better* than a photograph to be worth drawing, and
// these were not; see git history for the originals. The prop contract is
// unchanged, so nothing that feeds this component had to move: only what it
// renders is different.
//
// EVERY RULE THE DRAWINGS ANSWERED TO STILL HOLDS, in a form a camera can
// break where a pen could not:
//
//   Nothing may name the answer. The drawings could not leak because they
//   carried no text; a photograph can, and the leak just moves - a hull number,
//   a maker's plate, a fluke stamped with its own pattern name. Each of these
//   five was checked at full resolution before it was cropped. The only legible
//   text on any of them is a cast "U.S. NAVY" and a stock number on the fluke
//   anchor, which names a navy and not an anchor type.
//
//   Nothing may show a second anchor. A different pattern in the same frame is
//   a distractor the picture is not meant to supply, and the mushroom is
//   cropped hard at the right edge for exactly that reason - there is another
//   anchor on the quay beside it.
//
//   No bottom is illustrated for the bottom-matching questions. an-06 through
//   an-13 ask which anchor suits a given seabed and still get NO image at all;
//   see QUESTION_ANCHORS in ../index.tsx. That some of these five happen to be
//   photographed on sand or mud does not answer those questions, because those
//   questions are never shown a picture.
//
// Source and licence for all five are in src/lib/imageCredits.ts. They are
// public domain or Creative Commons; the CC ones require attribution, which is
// what that file exists to keep.
//
// Each is 640x480 - the 4:3 the old 220x170 viewBox was close to - so the panel
// below is the same size and shape it has always been.

const ANCHOR_IMAGES: Record<AnchorTypeName, string> = {
  fluke,
  plow,
  claw,
  grapnel,
  mushroom,
};

// Alt text describes the FRAME, never the pattern: a screen reader must get the
// same question a sighted player gets, not the answer to it.
const ALT = 'Photograph of an anchor, shown for identification';

export const AnchorDisplay: React.FC<AnchorDisplayProps> = ({ type, label }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      <img
        src={ANCHOR_IMAGES[type]}
        alt={ALT}
        width={640}
        height={480}
        draggable={false}
        className="w-full h-auto rounded-lg"
        style={{ display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }}
      />
    </div>
  </div>
);

export { ANCHOR_IMAGES };
