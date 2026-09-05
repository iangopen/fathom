import React from 'react';

import cirrus from '../../../assets/clouds/cirrus.jpg';
import cumulonimbus from '../../../assets/clouds/cumulonimbus.jpg';
import cumulus from '../../../assets/clouds/cumulus.jpg';
import halo from '../../../assets/clouds/halo.jpg';
import mackerel from '../../../assets/clouds/mackerel.jpg';

export type CloudName =
  // High ice cloud: the two forms that give about a day's notice
  | 'cirrus'
  | 'mackerel'
  | 'halo'
  // Convective cloud: the fair-weather one and the one that is an emergency
  | 'cumulus'
  | 'cumulonimbus';

interface CloudDisplayProps {
  type: CloudName;
  label?: string;
}

// A PHOTOGRAPH of the sky, not a drawing of one. Same change, and the same
// reasoning, as AnchorDisplay - see the note at the head of that file.
//
// Cloud is the harder case of the two, and the more obviously right one to
// photograph. An anchor is a manufactured object with a fixed silhouette, so a
// drawing of one can at least be checked against the casting. A cloud has no
// edges. What identifies cirrus is that it is fibrous and drawn out; what
// identifies a mackerel sky is a texture of hundreds of cloudlets in ripples;
// what identifies a halo is a ring of light in thin cloud. Fibre, texture and
// light are the three things flat vector shapes are worst at, and the old file
// was reduced to drawing a fixed number of strokes and a fixed grid of dots -
// a diagram of the idea of a mackerel sky rather than a mackerel sky.
//
// WHY THE WEATHER CARD HAS A PICTURE AT ALL is unchanged and still worth
// stating. Most of that card is text: a force number is a number and a wind
// shift is a rhythm over time, and neither can be shown honestly. Cloud form is
// the exception for the same reason buoyage is - the thing a person actually
// does on the water is LOOK at it and know which one it is. Sea state still
// does not qualify: forces 5 and 6 differ by how much foam is blowing, so
// nothing on the Beaufort half is illustrated, by photograph or otherwise.
//
// THE LEAK RULE, in its photographic form: nothing in frame may name the form.
// These are five skies. Four have a horizon in them for scale - without one a
// viewer cannot tell high thin cloud from low heaped cloud, which is half of
// what separates cirrus from cumulus - and the ground in each is a field, a
// treeline, a rooftop or the sea. None carries a sign, a caption or any legible
// text, which was checked at full resolution before cropping; the sea view is
// cropped short of the photographer's signature.
//
// Only the identify direction is illustrated. wx-19 asks which form calls for
// action now and wx-18 asks what makes a halo: the first would be answered
// outright by a picture of the thunderhead and the second is about ice
// crystals, which no photograph of the sky can show. See QUESTION_CLOUDS in
// ../index.tsx.
//
// Source and licence for all five are in src/lib/imageCredits.ts.
//
// Each is 640x480 - the 4:3 the old 220x170 viewBox was close to - so the panel
// below is the same size and shape it has always been.

const CLOUD_IMAGES: Record<CloudName, string> = {
  cirrus,
  mackerel,
  halo,
  cumulus,
  cumulonimbus,
};

// Alt text describes the FRAME, never the form: a screen reader must get the
// same question a sighted player gets, not the answer to it.
const ALT = 'Photograph of the sky, shown for identification';

export const CloudDisplay: React.FC<CloudDisplayProps> = ({ type, label }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      <img
        src={CLOUD_IMAGES[type]}
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

export { CLOUD_IMAGES };
