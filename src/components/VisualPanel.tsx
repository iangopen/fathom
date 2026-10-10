import React, { useId } from 'react';
import {
  QUESTION_LIGHTS,
  QUESTION_SCENARIOS,
  QUESTION_SHAPES,
  QUESTION_SOUNDS,
  QUESTION_SOUND_GAPS,
  QUESTION_VESSEL_TYPES,
  QUESTION_ANCHORS,
  QUESTION_BUOYS,
  QUESTION_DISTRESS,
  QUESTION_PFDS,
  QUESTION_BOAT_PARTS,
  QUESTION_CLOUDS,
  QUESTION_FLAGS,
  QUESTION_VISUAL_AFTER_ANSWER,
} from '../drills/colregs';
import { LightDisplay, describeLights } from '../drills/colregs/components/LightDisplay';
import { DayShapeDisplay } from '../drills/colregs/components/DayShapeDisplay';
import { VesselProfile } from '../drills/colregs/components/VesselProfile';
import { VesselScenario } from '../drills/colregs/components/VesselScenario';
import { SoundSignalDisplay } from '../drills/colregs/components/SoundSignalDisplay';
import { AnchorDisplay, ANCHOR_IMAGES } from '../drills/colregs/components/AnchorDisplay';
import { BuoyDisplay, BUOY_IMAGES } from '../drills/colregs/components/BuoyDisplay';
import { DistressDisplay, DISTRESS_IMAGES } from '../drills/colregs/components/DistressDisplay';
import { PfdDisplay, PFD_IMAGES } from '../drills/colregs/components/PfdDisplay';
import { BoatPartDisplay } from '../drills/colregs/components/BoatPartDisplay';
import { CloudDisplay, CLOUD_IMAGES } from '../drills/colregs/components/CloudDisplay';
import { SignalFlagDisplay } from '../drills/colregs/components/SignalFlagDisplay';
import { creditFor, ImageCredit, PhotoKind } from '../lib/imageCredits';
import { PhotoCredit } from './PhotoCredit';
import { SvgA11y } from '../lib/visualA11y';

// 75 of the 78 bank questions are answered from a picture rather than from the
// prompt text - "identify this vessel from what she is showing". The canvas
// design had no visual slot because its placeholder bank was all text, so this
// panel is an addition to it. Without one those questions are unanswerable.
//
// The visuals are the colregs drill's own components, reused unchanged. The
// dark ground they need comes from the shared .ct-instrument class in
// ChartFrame, which the compass drill's rose sits on too.

interface VisualPanelProps {
  questionId: string;
  // Gates the parts of a scenario diagram that state the give-way outcome.
  // False until the question is answered, so the picture cannot give away its
  // own answer - the same contract the colregs drill honours.
  revealed: boolean;
}

// One resolver, used by both the panel and the "is there a picture?" question
// the quiz grid asks. They used to be two independent lists - `hasVisual`
// tested `!== undefined` on ten maps while the panel tested each value for
// truthiness - and they agreed only because no map happens to hold a falsy
// value. A single falsy entry would have made `hasVisual` true and the panel
// null: the quiz body would reserve its 260px diagram column and draw nothing
// in it. Deriving one from the other removes that class of drift entirely.
//
// Precedence is the colregs drill's own, so a question carrying more than one
// mapping renders the same visual in both places.
//
// It also says which photograph, if any, the visual is - a buoy, distress
// signal or PFD is a photo for some names and a drawing for others, and only
// the display's own image map knows which. Deciding it here, in the same
// branch that picks the display, means the credit line cannot attach to a
// question whose visual turned out to be someone else's precedence.
// `kind` says what sort of thing the picture depicts, so the leak test can ask
// whether a question's answer is phrased in that picture's own terms - a sound
// question whose answer is a blast, beside a drawing of the blasts.
export type VisualKind =
  | 'vessel' | 'lights' | 'sounds' | 'shapes' | 'scenario' | 'anchor' | 'buoy'
  | 'distress' | 'pfd' | 'boat-part' | 'cloud' | 'flag';

interface ResolvedVisual {
  kind: VisualKind;
  // Drawn with the accessibility props the panel hands it - see VISUAL_NAMES.
  node: (a11y?: SvgA11y) => React.ReactNode;
  photo?: { kind: PhotoKind; name: string };
  // The text equivalent of a drawing, generated from the data that draws it.
  // Photographs carry their own frame-describing alt instead, and have none.
  description?: string;
}

// The accessible name of each kind of drawing. It names the KIND of picture,
// never what is in it; the description says what is in it.
export const VISUAL_NAMES: Record<VisualKind, string> = {
  vessel: 'Vessel diagram, side view',
  lights: 'Lights diagram, seen from above',
  sounds: 'Sound signal diagram',
  shapes: 'Day shapes diagram, seen from above',
  scenario: 'Vessel encounter diagram, seen from above',
  anchor: 'Anchor',
  buoy: 'Navigation mark diagram',
  distress: 'Signal diagram',
  pfd: 'Safety equipment diagram',
  'boat-part': 'Boat diagram with one part highlighted',
  cloud: 'Sky',
  flag: 'Signal flag diagram',
};

function photo(kind: PhotoKind, name: string, images: Record<string, string>) {
  return name in images ? { kind, name } : undefined;
}

function resolveVisual(questionId: string, revealed: boolean): ResolvedVisual | null {
  // A drawing that would answer its own question is held back until the
  // question has been answered - see QUESTION_VISUAL_AFTER_ANSWER.
  if (!revealed && QUESTION_VISUAL_AFTER_ANSWER.has(questionId)) return null;

  const node = (
    kind: VisualKind,
    n: (a11y?: SvgA11y) => React.ReactNode,
    p?: ResolvedVisual['photo'],
    description?: string
  ): ResolvedVisual => ({ kind, node: n, photo: p, description });

  const vesselType = QUESTION_VESSEL_TYPES[questionId];
  if (vesselType) return node('vessel', () => <VesselProfile type={vesselType} label="Vessel" />);

  const lights = QUESTION_LIGHTS[questionId];
  if (lights) {
    return node(
      'lights',
      (a11y) => <LightDisplay active={lights} label="Vessel Lights" a11y={a11y} />,
      undefined,
      describeLights(lights)
    );
  }

  const sounds = QUESTION_SOUNDS[questionId];
  if (sounds) {
    return node(
      'sounds',
      () => <SoundSignalDisplay
        key={questionId}
        sequence={sounds}
        gapS={QUESTION_SOUND_GAPS[questionId]}
        label="Blast Sequence"
      />
    );
  }

  const shapes = QUESTION_SHAPES[questionId];
  if (shapes) {
    return node(
      'shapes',
      () => <DayShapeDisplay
        shapes={shapes.shapes}
        position={shapes.position}
        arrangement={shapes.arrangement}
        label="Day Shapes"
      />
    );
  }

  const scenario = QUESTION_SCENARIOS[questionId];
  if (scenario) return node('scenario', () => <VesselScenario scenario={scenario} label="Scenario" revealed={revealed} />);

  const anchor = QUESTION_ANCHORS[questionId];
  if (anchor) return node('anchor', () => <AnchorDisplay type={anchor} label="Anchor" />, photo('anchor', anchor, ANCHOR_IMAGES));

  const buoy = QUESTION_BUOYS[questionId];
  if (buoy) return node('buoy', () => <BuoyDisplay type={buoy} label="Mark" />, photo('buoy', buoy, BUOY_IMAGES));

  const distress = QUESTION_DISTRESS[questionId];
  if (distress) return node('distress', () => <DistressDisplay signal={distress} label="Signal" />, photo('distress', distress, DISTRESS_IMAGES));

  const pfd = QUESTION_PFDS[questionId];
  if (pfd) return node('pfd', () => <PfdDisplay form={pfd} label="Device" />, photo('pfd', pfd, PFD_IMAGES));

  const boatPart = QUESTION_BOAT_PARTS[questionId];
  if (boatPart) return node('boat-part', () => <BoatPartDisplay part={boatPart} label="Highlighted" />);

  const cloud = QUESTION_CLOUDS[questionId];
  if (cloud) return node('cloud', () => <CloudDisplay type={cloud} label="Sky" />, photo('cloud', cloud, CLOUD_IMAGES));

  const flag = QUESTION_FLAGS[questionId];
  if (flag) return node('flag', () => <SignalFlagDisplay flag={flag} label="Hoist" />);

  return null;
}

// Whether a picture is drawn beside this question at this point. Before an
// answer, that is whether the question is answered from a picture. The only
// thing `revealed` changes is the handful of drawings held back until then
// (QUESTION_VISUAL_AFTER_ANSWER), so the grid passes it to make room for one
// when it appears.
export function hasVisual(questionId: string, revealed = false): boolean {
  return resolveVisual(questionId, revealed) !== null;
}

// What the picture beside this question depicts, before or after it is
// answered, or null when there is none. Exported for the leak test.
export function visualKind(questionId: string, revealed: boolean): VisualKind | null {
  return resolveVisual(questionId, revealed)?.kind ?? null;
}

// The text equivalent of the drawing beside this question at this point, or
// null when there is no drawing or it has none yet. A drawing held back until
// the answer (QUESTION_VISUAL_AFTER_ANSWER) has no description before it
// either, because there is nothing resolved to describe. Exported for the leak
// guard and the description tests.
export function visualDescription(questionId: string, revealed: boolean): string | null {
  return resolveVisual(questionId, revealed)?.description ?? null;
}

// The credit for the photograph this question shows, or undefined when its
// visual is a drawing or there is none. Exported for the credit tests.
export function photoCreditFor(questionId: string): ImageCredit | undefined {
  const p = resolveVisual(questionId, false)?.photo;
  return p && creditFor(p.kind, p.name);
}

export const VisualPanel: React.FC<VisualPanelProps> = ({ questionId, revealed }) => {
  // Not derived from the question id: two questions with the same drawing must
  // render the same markup, and the id would be the one difference.
  const descriptionId = useId();
  const resolved = resolveVisual(questionId, revealed);

  // A question with no mapping draws nothing at all. That is necessary but it
  // was not sufficient: this panel and the ScenarioCard beside it are siblings,
  // and while they shared the key `current.id` React stopped unmounting this
  // one, so returning null here still left the previous diagram in the
  // document. The caller keys them apart now - see the note there.
  if (!resolved) return null;
  const credit = resolved.photo && creditFor(resolved.photo.kind, resolved.photo.name);
  const a11y = resolved.description
    ? { name: VISUAL_NAMES[resolved.kind], describedBy: descriptionId }
    : undefined;

  return (
    <div className="ct-instrument">
      <div className="ct-instrument-label">Observed</div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{resolved.node(a11y)}</div>
      {/* Read after the drawing's name, through aria-describedby. Hidden from
          sight for now: whether sighted players get a "Describe" toggle is a
          product decision still to make. */}
      {resolved.description && (
        <p id={descriptionId} className="sr-only">
          {resolved.description}
        </p>
      )}
      {credit && <PhotoCredit credit={credit} revealed={revealed} />}
    </div>
  );
};
