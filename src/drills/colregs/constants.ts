export type ColregsCategory =
  | 'navigation-lights'
  | 'sound-signals'
  | 'vessel-hierarchy'
  | 'day-shapes'
  | 'vessel-types'
  | 'anchor-types'
  | 'buoyage'
  | 'chart-symbols'
  | 'distress-signals'
  | 'vhf-procedure'
  | 'pfd-types'
  | 'fire-safety'
  | 'deck-seamanship'
  | 'weather'
  | 'tides'
  | 'signal-flags';

export interface ColregsQuestion {
  id: string;
  category: ColregsCategory;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Not everything in this bank is governed by the COLREGS. Anchor types are
// seamanship knowledge and buoyage is a separate international system: there
// is no rule number to cite for either, so those explanations carry a topic
// label instead ("Ground tackle:", "IALA-B:") and the citation format test
// holds them to that shape rather than to "Rule N(x)".
//
// This list is the single place that says which categories are outside the
// rules, so the next one - PFD types, fire safety - is added here and every
// consumer follows. See src/lib/citation.ts and
// src/__tests__/citationFormat.test.ts.
export const NON_COLREGS_CATEGORIES: ColregsCategory[] = [
  'anchor-types',
  'buoyage',
  'chart-symbols',
  'vhf-procedure',
  'pfd-types',
  'fire-safety',
  'deck-seamanship',
  'weather',
  'tides',
  'signal-flags',
];

// Distress signals are NOT in that list, and the near miss is worth saying out
// loud: Annex IV to the Convention is headed "Distress Signals" and Rule 37
// sends a vessel in distress to it, so that category has a real citation and
// takes the ordinary path. VHF procedure sits beside it in the same section
// and is the opposite case - channel discipline and the three priority calls
// are radio regulation, not COLREGS, and no rule number covers them.

export function isColregsGoverned(question: ColregsQuestion): boolean {
  return !NON_COLREGS_CATEGORIES.includes(question.category);
}

// The topic labels a non-COLREGS explanation may open with, standing where the
// rule citation stands on a governed one. Closed set for the same reason the
// citation is a fixed shape: so a later edit cannot quietly invent a label
// that renders as a badge nobody recognises.
//
// Each names the actual authority the content rests on, which is the whole
// point of the badge - "IALA-B" is the buoyage region the United States lies
// in, "US ATON" is the Coast Guard's own aid-to-navigation practice on top of
// it (the ICW overlay lives there and nowhere in IALA), and the two ground
// tackle labels are seamanship, which has no publication behind it at all.
// "Chart No. 1" is the NOAA and NGA publication every symbol and abbreviation
// in the chart symbols bank is read out of, and "Radio procedure" covers the
// VHF calls, which are governed by radio regulation rather than by the Rules.
// "Life-saving equipment" is the Coast Guard's own carriage and approval
// requirements, which are equipment regulation and not a rule of the road.
// "Beaufort scale" is Beaufort's own observation scale, kept by the WMO;
// "Cloud reading" is meteorology; and "Weather lore" is the one label on this
// list that names no authority whatever, which is the honest thing to say
// about a rhyme that is right more often than chance and is not a forecast.
// "Tides" and "Tidal currents" are two labels rather than one because the
// distinction between them - the water going up and down against the water
// going sideways - is the single thing that half that card exists to teach.
// "International Code of Signals" is the IMO publication itself, and it earns
// a label of exactly the same kind as IALA-B: a real, published, international
// system that the Rules do not govern and cannot be cited for.
export const TOPIC_LABELS = [
  'Ground tackle',
  'Holding ground',
  'IALA-B',
  'US ATON',
  'Chart No. 1',
  'Radio procedure',
  'Life-saving equipment',
  'Fire safety',
  'Hull and deck',
  'Rigging',
  'Helm orders',
  'Beaufort scale',
  'Cloud reading',
  'Weather lore',
  'Tides',
  'Tidal currents',
  'International Code of Signals',
] as const;

// --- NAVIGATION LIGHTS (20 questions) ---

const navigationLightsQuestions: ColregsQuestion[] = [
  {
    id: 'nl-01',
    category: 'navigation-lights',
    prompt: 'What color is a vessel\'s starboard sidelight?',
    options: ['Red', 'Green', 'White', 'Yellow'],
    correctAnswer: 'Green',
    explanation:
      'Rule 21: The starboard sidelight is green, showing from dead ahead to 22.5° abaft the beam on the starboard side (112.5° arc).',
  },
  {
    id: 'nl-02',
    category: 'navigation-lights',
    prompt: 'What color is a vessel\'s port sidelight?',
    options: ['Red', 'Green', 'White', 'Yellow'],
    correctAnswer: 'Red',
    explanation:
      'Rule 21: The port sidelight is red, showing from dead ahead to 22.5° abaft the beam on the port side (112.5° arc).',
  },
  {
    id: 'nl-03',
    category: 'navigation-lights',
    prompt: 'What is the arc of visibility for a vessel\'s masthead (steaming) light?',
    options: ['112.5°', '135°', '225°', '360°'],
    correctAnswer: '225°',
    explanation:
      'Rule 21: The masthead light shows an unbroken arc of 225°, from dead ahead to 22.5° abaft the beam on each side.',
  },
  {
    id: 'nl-04',
    category: 'navigation-lights',
    prompt: 'A power-driven vessel underway and making way must display which lights at night?',
    options: [
      'Masthead light, sidelights, and sternlight',
      'Sidelights and sternlight only',
      'Two masthead lights and sidelights',
      'All-round white light and sidelights',
    ],
    correctAnswer: 'Masthead light, sidelights, and sternlight',
    explanation:
      'Rule 23: A power-driven vessel underway shall exhibit a masthead light forward, sidelights, and a sternlight.',
  },
  {
    id: 'nl-05',
    category: 'navigation-lights',
    prompt: 'What lights does a vessel at anchor less than 50 metres in length display at night?',
    options: [
      'One all-round white light',
      'Two all-round white lights (fore and aft)',
      'Red over white all-round lights',
      'Masthead light only',
    ],
    correctAnswer: 'One all-round white light',
    explanation:
      'Rule 30: A vessel less than 50 metres at anchor shows one all-round white light where best seen.',
  },
  {
    id: 'nl-06',
    category: 'navigation-lights',
    prompt: 'What is the arc of visibility for a sternlight?',
    options: ['112.5°', '135°', '225°', '360°'],
    correctAnswer: '135°',
    explanation:
      'Rule 21: The sternlight is white and shows over an arc of 135°, from dead astern to 67.5° on each side.',
  },
  {
    id: 'nl-07',
    category: 'navigation-lights',
    prompt: 'A vessel not under command at night displays which lights?',
    options: [
      'Two all-round red lights in a vertical line',
      'Three all-round red lights in a vertical line',
      'Red over white all-round lights in a vertical line',
      'Two all-round white lights in a vertical line',
    ],
    correctAnswer: 'Two all-round red lights in a vertical line',
    explanation:
      'Rule 27: A vessel not under command shows two all-round red lights in a vertical line where best seen.',
  },
  {
    id: 'nl-08',
    category: 'navigation-lights',
    prompt: 'A vessel engaged in towing where the tow exceeds 200 metres in length must show how many masthead lights?',
    options: ['One', 'Two', 'Three', 'Four'],
    correctAnswer: 'Three',
    explanation:
      'Rule 24: When the length of the tow exceeds 200 metres, the towing vessel shows three masthead lights in a vertical line.',
  },
  {
    id: 'nl-09',
    category: 'navigation-lights',
    prompt: 'What lights does a vessel constrained by her draft display in addition to normal power-driven vessel lights?',
    options: [
      'Three all-round red lights in a vertical line',
      'Three all-round white lights in a vertical line',
      'Red over white over red all-round lights',
      'Two all-round red lights',
    ],
    correctAnswer: 'Three all-round red lights in a vertical line',
    explanation:
      'Rule 28: A vessel constrained by her draft may additionally exhibit three all-round red lights in a vertical line.',
  },
  {
    id: 'nl-10',
    category: 'navigation-lights',
    prompt: 'A vessel engaged in pilotage duty shows which all-round lights?',
    options: [
      'White over red in a vertical line',
      'Red over white in a vertical line',
      'Two all-round white lights',
      'White over green in a vertical line',
    ],
    correctAnswer: 'White over red in a vertical line',
    explanation:
      'Rule 29: A pilot vessel on duty shows an all-round white light over an all-round red light at or near the masthead.',
  },
  {
    id: 'nl-11',
    category: 'navigation-lights',
    prompt: 'A sailing vessel underway displays which lights?',
    options: [
      'Sidelights and a sternlight',
      'Sidelights, a sternlight and one masthead light',
      'Two all-round red lights and sidelights',
      'An all-round white light only',
    ],
    correctAnswer: 'Sidelights and a sternlight',
    explanation:
      'Rule 25(a): A sailing vessel underway exhibits sidelights and a sternlight. She carries no masthead (steaming) light - that light marks a vessel under power.',
  },
  {
    id: 'nl-12',
    category: 'navigation-lights',
    prompt: 'A power-driven vessel of less than 12 metres in length may, instead of the full set, display which lights?',
    options: [
      'An all-round white light and sidelights',
      'An all-round white light alone',
      'A masthead light and a sternlight only',
      'Two all-round white lights in a vertical line',
    ],
    correctAnswer: 'An all-round white light and sidelights',
    explanation:
      'Rule 23(d)(i): A power-driven vessel of less than 12 metres in length may exhibit an all-round white light and sidelights in place of the masthead light, sidelights and sternlight.',
  },
  {
    id: 'nl-13',
    category: 'navigation-lights',
    prompt: 'A sailing vessel of less than 20 metres may combine her sidelights and sternlight in what single fitting?',
    options: [
      'One tricolour lantern at or near the top of the mast',
      'One all-round white light at the masthead',
      'One all-round red light at the masthead',
      'A single combined lantern at the stemhead',
    ],
    correctAnswer: 'One tricolour lantern at or near the top of the mast',
    explanation:
      'Rule 25(b): In a sailing vessel of less than 20 metres the sidelights and sternlight may be combined in one lantern carried at or near the top of the mast. An observer still sees the same three sectors - red, green and white.',
  },
  {
    id: 'nl-14',
    category: 'navigation-lights',
    prompt: 'A vessel engaged in trawling displays which pair of all-round lights in a vertical line?',
    options: [
      'Green over white',
      'Red over white',
      'White over red',
      'Red over green',
    ],
    correctAnswer: 'Green over white',
    explanation:
      'Rule 26(b)(i): A vessel engaged in trawling shows two all-round lights in a vertical line, the upper green and the lower white, plus sidelights and a sternlight when making way through the water.',
  },
  {
    id: 'nl-15',
    category: 'navigation-lights',
    prompt: 'A vessel engaged in fishing OTHER than trawling displays which pair of all-round lights in a vertical line?',
    options: [
      'Red over white',
      'Green over white',
      'White over red',
      'Red over red',
    ],
    correctAnswer: 'Red over white',
    explanation:
      'Rule 26(c)(i): A vessel engaged in fishing other than trawling shows two all-round lights in a vertical line, the upper red and the lower white. Remember it as "red over white, fishing at night".',
  },
  {
    id: 'nl-16',
    category: 'navigation-lights',
    prompt: 'A vessel restricted in her ability to manoeuvre displays which three all-round lights in a vertical line?',
    options: [
      'Red, white, red',
      'Red, red, red',
      'White, red, white',
      'Green, white, green',
    ],
    correctAnswer: 'Red, white, red',
    explanation:
      'Rule 27(b)(i): A vessel restricted in her ability to manoeuvre shows three all-round lights in a vertical line - the highest and lowest red, the middle white. Remember it as "red, white, red - restricted ahead".',
  },
  {
    id: 'nl-17',
    category: 'navigation-lights',
    prompt: 'What light does a towing vessel show above her sternlight?',
    options: [
      'A yellow towing light',
      'A second white sternlight',
      'An all-round red light',
      'A flashing blue light',
    ],
    correctAnswer: 'A yellow towing light',
    explanation:
      'Rule 24(a)(iv): A vessel towing exhibits a yellow towing light in a vertical line above her sternlight. It has the same 135 degree arc as the sternlight it sits above.',
  },
  {
    id: 'nl-18',
    category: 'navigation-lights',
    prompt: 'A vessel at anchor of 50 metres or more in length displays how many anchor lights, and where?',
    options: [
      'Two - one in the fore part and a lower one at or near the stern',
      'One - in the fore part only',
      'Two - both at the masthead in a vertical line',
      'Three - in a vertical line at the masthead',
    ],
    correctAnswer: 'Two - one in the fore part and a lower one at or near the stern',
    explanation:
      'Rule 30(a): A vessel at anchor exhibits an all-round white light in the fore part and, if 50 metres or more in length, a second all-round white light at or near the stern and lower than the forward one.',
  },
  {
    id: 'nl-19',
    category: 'navigation-lights',
    prompt: 'An air-cushion vessel operating in the non-displacement mode exhibits what additional light?',
    options: [
      'An all-round flashing yellow light',
      'An all-round flashing blue light',
      'An all-round flashing red light',
      'A second masthead light',
    ],
    correctAnswer: 'An all-round flashing yellow light',
    explanation:
      'Rule 23(b): An air-cushion vessel operating in the non-displacement mode exhibits, in addition to the lights of a power-driven vessel, an all-round flashing yellow light.',
  },
  {
    id: 'nl-20',
    category: 'navigation-lights',
    prompt: 'Over what arc is each sidelight visible?',
    options: ['112.5 degrees', '135 degrees', '225 degrees', '360 degrees'],
    correctAnswer: '112.5 degrees',
    explanation:
      'Rule 21(b): Each sidelight shows an unbroken light over an arc of 112.5 degrees, from right ahead to 22.5 degrees abaft the beam on its own side. The two sidelights and the 135 degree sternlight together make up the full 360.',
  },
  // --- Identify direction (nl-21 onward) -------------------------------
  //
  // The twenty questions above name a vessel and ask which lights she shows.
  // These name nothing and show the lights: the picture is the stimulus and
  // the answer is what she is. That is the only direction LightDisplay can be
  // used in honestly - see the note beside QUESTION_LIGHTS in ../index.tsx -
  // and the facts here are the same verified facts as above, read the other
  // way round.
  //
  // Where the arrangement alone would not settle it, the prompt says so: "the
  // only lights she is showing" is what separates a vessel not making way from
  // one that is, and nl-33 states in words that its yellow light is flashing,
  // because a still drawing cannot carry a rhythm.
  {
    id: 'nl-21',
    category: 'navigation-lights',
    prompt: 'A vessel is showing the lights above. What is she?',
    options: [
      'A power-driven vessel underway and making way',
      'A sailing vessel underway',
      'A vessel at anchor',
      'A vessel not under command',
    ],
    correctAnswer: 'A power-driven vessel underway and making way',
    explanation:
      'Rule 23(a): A masthead light forward, sidelights and a sternlight is the ordinary power-driven vessel underway. The masthead light is the one that says power-driven - a sailing vessel shows the same sidelights and sternlight without it.',
  },
  {
    id: 'nl-22',
    category: 'navigation-lights',
    prompt: 'This single all-round white light is the only light a vessel is showing. What is she?',
    options: [
      'A vessel at anchor, less than 50 metres in length',
      'A power-driven vessel of less than 12 metres underway',
      'A vessel aground',
      'A vessel restricted in her ability to manoeuvre',
    ],
    correctAnswer: 'A vessel at anchor, less than 50 metres in length',
    explanation:
      'Rule 30(b): A vessel of less than 50 metres at anchor may show one all-round white light where it can best be seen. A power-driven vessel under 12 metres shows an all-round white too, but with her sidelights alongside it - one white light on its own, with nothing else, is a vessel at anchor.',
  },
  {
    id: 'nl-23',
    category: 'navigation-lights',
    prompt: 'These two all-round red lights are the only lights a vessel is showing. What is she?',
    options: [
      'A vessel not under command and not making way through the water',
      'A vessel constrained by her draught',
      'A vessel aground',
      'A vessel engaged in fishing other than trawling',
    ],
    correctAnswer: 'A vessel not under command and not making way through the water',
    explanation:
      'Rule 27(a): Two all-round red lights in a vertical line is not under command. She adds sidelights and a sternlight when making way through the water, so two reds and nothing else says she is stopped as well as unable to manoeuvre.',
  },
  {
    id: 'nl-24',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing an all-round white over an all-round red, with sidelights and a sternlight. What is she?',
    options: [
      'A vessel engaged on pilotage duty, underway',
      'A vessel engaged in fishing other than trawling',
      'A vessel restricted in her ability to manoeuvre',
      'A vessel constrained by her draught',
    ],
    correctAnswer: 'A vessel engaged on pilotage duty, underway',
    explanation:
      'Rule 29(a): White over red at or near the masthead is the pilot vessel on duty, with sidelights and a sternlight when underway. Reverse the two and you have red over white, which is a vessel fishing - the order of the pair is the whole of the difference.',
  },
  {
    id: 'nl-25',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing sidelights and a sternlight, and no masthead light at all. What is she?',
    options: [
      'A sailing vessel underway',
      'A power-driven vessel underway',
      'A vessel being towed',
      'A vessel at anchor',
    ],
    correctAnswer: 'A sailing vessel underway',
    explanation:
      'Rule 25(a): A sailing vessel underway shows sidelights and a sternlight and nothing above them. The absence of the masthead light is the signal: the moment she starts her engine she becomes a power-driven vessel and must show one.',
  },
  {
    id: 'nl-26',
    category: 'navigation-lights',
    prompt: 'A vessel is showing an all-round white light and sidelights. What is she?',
    options: [
      'A power-driven vessel of less than 12 metres in length, underway',
      'A vessel at anchor with her deck lights on',
      'A vessel engaged in trawling',
      'A pilot vessel on station',
    ],
    correctAnswer: 'A power-driven vessel of less than 12 metres in length, underway',
    explanation:
      'Rule 23(d)(i): A power-driven vessel of less than 12 metres may show an all-round white light and sidelights in place of the masthead light and sternlight. The all-round white is standing in for both of them at once, which is why it is legal to have neither.',
  },
  {
    id: 'nl-27',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing an all-round green over an all-round white, with sidelights and a sternlight. What is she?',
    options: [
      'A vessel engaged in trawling, making way through the water',
      'A vessel engaged in fishing other than trawling',
      'A vessel engaged in dredging',
      'A vessel restricted in her ability to manoeuvre',
    ],
    correctAnswer: 'A vessel engaged in trawling, making way through the water',
    explanation:
      'Rule 26(b): Green over white is trawling - dragging a dredge or other apparatus through the water. The sidelights and sternlight say she is making way as well as fishing. "Green over white, trawling tonight" is the rhyme that keeps it apart from the other fishing pair.',
  },
  {
    id: 'nl-28',
    category: 'navigation-lights',
    prompt:
      'These two lights - an all-round red over an all-round white - are the only lights a vessel is showing. What is she?',
    options: [
      'A vessel engaged in fishing other than trawling, not making way',
      'A vessel engaged in trawling',
      'A vessel engaged on pilotage duty',
      'A vessel not under command',
    ],
    correctAnswer: 'A vessel engaged in fishing other than trawling, not making way',
    explanation:
      'Rule 26(c): Red over white is fishing other than trawling - "red over white, fishing at night". She shows sidelights and a sternlight in addition when making way, so this pair alone is a fishing vessel lying stopped to her gear.',
  },
  {
    id: 'nl-29',
    category: 'navigation-lights',
    prompt:
      'These three all-round lights - red, white, red in a vertical line - are the only lights a vessel is showing. What is she?',
    options: [
      'A vessel restricted in her ability to manoeuvre, not making way',
      'A vessel constrained by her draught',
      'A vessel not under command',
      'A vessel aground',
    ],
    correctAnswer: 'A vessel restricted in her ability to manoeuvre, not making way',
    explanation:
      'Rule 27(b)(i): Red over white over red is restricted in her ability to manoeuvre - the white in the middle is what separates her from the three reds of a vessel constrained by her draught and from the two reds of one not under command. Sidelights and a sternlight are added when making way.',
  },
  {
    id: 'nl-30',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing two masthead lights in a vertical line, sidelights, a sternlight, and a yellow light directly above that sternlight. What is she?',
    options: [
      'A power-driven vessel towing astern, the length of the tow 200 metres or less',
      'A power-driven vessel towing astern, the length of the tow more than 200 metres',
      'A vessel engaged in pushing ahead',
      'An air-cushion vessel in the non-displacement mode',
    ],
    correctAnswer: 'A power-driven vessel towing astern, the length of the tow 200 metres or less',
    explanation:
      'Rule 24(a): A vessel towing shows two masthead lights in a vertical line and a yellow towing light above her sternlight. The towing light is what names her; the number of masthead lights is what tells you how long the tow is, and two of them means 200 metres or less.',
  },
  {
    id: 'nl-31',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing three masthead lights in a vertical line, sidelights, a sternlight, and a yellow light above that sternlight. What is she?',
    options: [
      'A power-driven vessel towing, the length of the tow exceeding 200 metres',
      'A power-driven vessel towing, the length of the tow 200 metres or less',
      'A vessel not under command with way on',
      'A vessel engaged in dredging',
    ],
    correctAnswer: 'A power-driven vessel towing, the length of the tow exceeding 200 metres',
    explanation:
      'Rule 24(a)(i): Three masthead lights in a vertical line instead of two is the signal that the tow, measured from the stern of the towing vessel to the after end of the tow, exceeds 200 metres. Counting them is the only way to know how much water astern of her has to be left alone.',
  },
  {
    id: 'nl-32',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing two all-round white lights, one in the fore part and a lower one at the after end, and nothing else. What is she?',
    options: [
      'A vessel at anchor, 50 metres or more in length',
      'A vessel at anchor, less than 50 metres in length',
      'A vessel aground',
      'A vessel engaged in mineclearance',
    ],
    correctAnswer: 'A vessel at anchor, 50 metres or more in length',
    explanation:
      'Rule 30(a): A vessel at anchor shows an all-round white light in the fore part and a second, lower one at or near the stern. The second light is what a vessel of 50 metres or more must show, so seeing two rather than one tells you both that she is anchored and that she is big.',
  },
  {
    id: 'nl-33',
    category: 'navigation-lights',
    prompt:
      'A vessel is showing the lights of a power-driven vessel underway plus the all-round yellow light above, which is FLASHING. What is she?',
    options: [
      'An air-cushion vessel operating in the non-displacement mode',
      'A vessel towing astern',
      'A vessel engaged in dredging with an obstruction on one side',
      'A submarine on the surface',
    ],
    correctAnswer: 'An air-cushion vessel operating in the non-displacement mode',
    explanation:
      'Rule 23(b): An air-cushion vessel in the non-displacement mode shows an all-round flashing yellow light in addition to her ordinary power-driven lights. The flash is the whole signal - a steady yellow above the sternlight is a towing light and means something else entirely.',
  },
];

// --- SOUND SIGNALS (16 questions) ---

const soundSignalsQuestions: ColregsQuestion[] = [
  {
    id: 'ss-01',
    category: 'sound-signals',
    prompt: 'In sight of one another, what sound signal indicates a vessel is altering course to starboard?',
    options: ['One short blast', 'Two short blasts', 'Three short blasts', 'One prolonged blast'],
    correctAnswer: 'One short blast',
    explanation:
      'Rule 34: One short blast means "I am altering my course to starboard."',
  },
  {
    id: 'ss-02',
    category: 'sound-signals',
    prompt: 'What sound signal indicates a vessel is altering course to port?',
    options: ['One short blast', 'Two short blasts', 'Three short blasts', 'One prolonged blast'],
    correctAnswer: 'Two short blasts',
    explanation:
      'Rule 34: Two short blasts mean "I am altering my course to port."',
  },
  {
    id: 'ss-03',
    category: 'sound-signals',
    prompt: 'What sound signal indicates a vessel\'s engines are going astern?',
    options: ['One short blast', 'Two short blasts', 'Three short blasts', 'One prolonged blast'],
    correctAnswer: 'Three short blasts',
    explanation:
      'Rule 34: Three short blasts mean "I am operating astern propulsion." This does not necessarily mean the vessel is moving astern.',
  },
  {
    id: 'ss-04',
    category: 'sound-signals',
    prompt: 'A power-driven vessel underway in restricted visibility must sound which signal at intervals of not more than 2 minutes?',
    options: [
      'One prolonged blast',
      'Two prolonged blasts',
      'One prolonged followed by two short blasts',
      'Three short blasts',
    ],
    correctAnswer: 'One prolonged blast',
    explanation:
      'Rule 35: A power-driven vessel making way through the water in restricted visibility sounds one prolonged blast at intervals of not more than 2 minutes.',
  },
  {
    id: 'ss-05',
    category: 'sound-signals',
    prompt: 'A power-driven vessel underway but stopped (not making way) in restricted visibility sounds which signal?',
    options: [
      'One prolonged blast',
      'Two prolonged blasts',
      'One prolonged followed by two short blasts',
      'Three short blasts',
    ],
    correctAnswer: 'Two prolonged blasts',
    explanation:
      'Rule 35: A power-driven vessel underway but stopped and making no way through the water sounds two prolonged blasts at intervals of not more than 2 minutes.',
  },
  {
    id: 'ss-06',
    category: 'sound-signals',
    prompt: 'A vessel not under command, restricted in ability to maneuver, constrained by draft, sailing, fishing, or towing sounds which fog signal?',
    options: [
      'One prolonged blast every 2 minutes',
      'Two prolonged blasts every 2 minutes',
      'One prolonged followed by two short blasts every 2 minutes',
      'Three short blasts every 2 minutes',
    ],
    correctAnswer: 'One prolonged followed by two short blasts every 2 minutes',
    explanation:
      'Rule 35: These vessels sound one prolonged followed by two short blasts at intervals of not more than 2 minutes.',
  },
  {
    id: 'ss-07',
    category: 'sound-signals',
    prompt: 'What is the duration of a "short blast"?',
    options: ['About 1 second', 'About 2 seconds', '4 to 6 seconds', '8 to 10 seconds'],
    correctAnswer: 'About 1 second',
    explanation:
      'Rule 32(b): A short blast is a blast of about one second duration.',
  },
  {
    id: 'ss-08',
    category: 'sound-signals',
    prompt: 'A vessel at anchor in restricted visibility rings a bell rapidly for about 5 seconds at intervals of not more than how many minutes?',
    options: ['1 minute', '2 minutes', '3 minutes', '5 minutes'],
    correctAnswer: '1 minute',
    explanation:
      'Rule 35: A vessel at anchor sounds a rapid ringing of the bell for about 5 seconds at intervals of not more than 1 minute.',
  },
  {
    id: 'ss-09',
    category: 'sound-signals',
    prompt: 'What does a signal of at least five short and rapid blasts mean?',
    options: [
      'I doubt whether you are taking sufficient action to avoid collision',
      'I am altering course to starboard',
      'I am aground',
      'I intend to overtake you',
    ],
    correctAnswer: 'I doubt whether you are taking sufficient action to avoid collision',
    explanation:
      'Rule 34(d): When vessels in sight of one another fail to understand each other\'s intentions, or one doubts whether sufficient action is being taken to avoid collision, she sounds at least five short and rapid blasts - the doubt or wake-up signal.',
  },
  {
    id: 'ss-10',
    category: 'sound-signals',
    prompt: 'A vessel nearing a bend where other vessels may be obscured sounds which signal?',
    options: [
      'One prolonged blast',
      'Two prolonged blasts',
      'One short blast',
      'Five short blasts',
    ],
    correctAnswer: 'One prolonged blast',
    explanation:
      'Rule 34(e): A vessel nearing a bend or an area of a channel where other vessels may be obscured sounds one prolonged blast, to be answered with a prolonged blast by any approaching vessel within hearing.',
  },
  {
    id: 'ss-11',
    category: 'sound-signals',
    prompt: 'In a narrow channel, which signal means "I intend to overtake you on your starboard side"?',
    options: [
      'Two prolonged blasts followed by one short blast',
      'Two prolonged blasts followed by two short blasts',
      'One prolonged blast followed by one short blast',
      'Three short blasts',
    ],
    correctAnswer: 'Two prolonged blasts followed by one short blast',
    explanation:
      'Rule 34(c)(i): In a narrow channel or fairway, a vessel intending to overtake sounds two prolonged blasts followed by one short blast to mean "I intend to overtake you on your starboard side".',
  },
  {
    id: 'ss-12',
    category: 'sound-signals',
    prompt: 'In a narrow channel, which signal means "I intend to overtake you on your port side"?',
    options: [
      'Two prolonged blasts followed by two short blasts',
      'Two prolonged blasts followed by one short blast',
      'Two short blasts',
      'One prolonged and two short blasts',
    ],
    correctAnswer: 'Two prolonged blasts followed by two short blasts',
    explanation:
      'Rule 34(c)(i): Two prolonged blasts followed by two short blasts means "I intend to overtake you on your port side". One short for starboard, two short for port - the same convention as the Rule 34(a) manoeuvring signals.',
  },
  {
    id: 'ss-13',
    category: 'sound-signals',
    prompt: 'How does the vessel about to be overtaken signal her agreement to the overtaking?',
    options: [
      'One prolonged, one short, one prolonged and one short blast, in that order',
      'Two prolonged blasts',
      'Three short blasts',
      'Five short and rapid blasts',
    ],
    correctAnswer: 'One prolonged, one short, one prolonged and one short blast, in that order',
    explanation:
      'Rule 34(c)(ii): The vessel about to be overtaken, if in agreement, sounds one prolonged, one short, one prolonged and one short blast in that order. Anything else - in particular five short blasts - is not agreement.',
  },
  {
    id: 'ss-14',
    category: 'sound-signals',
    prompt: 'A vessel at anchor may sound which signal to warn an approaching vessel of her position?',
    options: [
      'One short, one prolonged and one short blast',
      'One prolonged blast',
      'Two prolonged blasts',
      'Three short blasts',
    ],
    correctAnswer: 'One short, one prolonged and one short blast',
    explanation:
      'Rule 35(g): A vessel at anchor may in addition sound three blasts in succession - short, prolonged, short - to give warning of her position and of the possibility of collision to an approaching vessel.',
  },
  {
    id: 'ss-15',
    category: 'sound-signals',
    prompt: 'A vessel aground signals her bell how, in restricted visibility?',
    options: [
      'Three separate strokes before and after the rapid ringing of the bell',
      'Rapid ringing of the bell alone, as if at anchor',
      'Two separate strokes after the rapid ringing only',
      'Continuous ringing for one minute',
    ],
    correctAnswer: 'Three separate strokes before and after the rapid ringing of the bell',
    explanation:
      'Rule 35(h): A vessel aground gives the bell signal of a vessel at anchor and in addition three separate and distinct strokes on the bell immediately before and after the rapid ringing.',
  },
  {
    id: 'ss-16',
    category: 'sound-signals',
    prompt: 'What is the duration of a "prolonged blast"?',
    options: [
      'From four to six seconds',
      'About one second',
      'From two to three seconds',
      'About ten seconds',
    ],
    correctAnswer: 'From four to six seconds',
    explanation:
      'Rule 32(c): A prolonged blast is a blast of from four to six seconds duration. Rule 32(b) defines a short blast as about one second.',
  },
];

// --- VESSEL HIERARCHY (20 questions) ---

const vesselHierarchyQuestions: ColregsQuestion[] = [
  {
    id: 'vh-01',
    category: 'vessel-hierarchy',
    prompt: 'According to the COLREGS stand-on/give-way hierarchy, which vessel type has the highest priority (least burdened)?',
    options: [
      'Vessel not under command',
      'Vessel constrained by her draft',
      'Vessel engaged in fishing',
      'Sailing vessel',
    ],
    correctAnswer: 'Vessel not under command',
    explanation:
      'Rule 18: The vessel not under command (NUC) sits at the top of the hierarchy. All other vessels must keep clear of an NUC vessel.',
  },
  {
    id: 'vh-02',
    category: 'vessel-hierarchy',
    prompt: 'A sailing vessel underway must keep clear of which of the following?',
    options: [
      'A power-driven vessel',
      'A vessel restricted in ability to maneuver',
      'A vessel constrained by her draft',
      'Both a RAM vessel and a vessel constrained by her draft',
    ],
    correctAnswer: 'Both a RAM vessel and a vessel constrained by her draft',
    explanation:
      'Rule 18: A sailing vessel must keep out of the way of vessels not under command, restricted in ability to maneuver, and engaged in fishing. She must also keep clear of a vessel constrained by her draft.',
  },
  {
    id: 'vh-03',
    category: 'vessel-hierarchy',
    prompt: 'In a crossing situation, a power-driven vessel has another vessel on her starboard side. Which vessel is the give-way vessel?',
    options: [
      'The vessel on the starboard side is give-way',
      'The vessel with the other on her starboard side is give-way',
      'The faster vessel is give-way',
      'The larger vessel is stand-on',
    ],
    correctAnswer: 'The vessel with the other on her starboard side is give-way',
    explanation:
      'Rule 15: When two power-driven vessels are crossing, the vessel which has the other on her own starboard side shall keep out of the way.',
  },
  {
    id: 'vh-04',
    category: 'vessel-hierarchy',
    prompt: 'In a head-on situation between two power-driven vessels, what must each vessel do?',
    options: [
      'The stand-on vessel maintains course; the give-way vessel turns to port',
      'Both vessels alter course to starboard',
      'The smaller vessel gives way',
      'The slower vessel gives way',
    ],
    correctAnswer: 'Both vessels alter course to starboard',
    explanation:
      'Rule 14: When two power-driven vessels are meeting head-on, each shall alter her course to starboard so they pass port-to-port.',
  },
  {
    id: 'vh-05',
    category: 'vessel-hierarchy',
    prompt: 'A vessel is considered to be overtaking when she approaches another vessel from a direction more than how many degrees abaft the beam?',
    options: ['22.5°', '45°', '67.5°', '90°'],
    correctAnswer: '22.5°',
    explanation:
      'Rule 13: A vessel is overtaking when she comes up on another vessel from a direction more than 22.5° abaft her beam (i.e., the sternlight sector).',
  },
  {
    id: 'vh-06',
    category: 'vessel-hierarchy',
    prompt: 'In an overtaking situation, which vessel is the give-way vessel?',
    options: [
      'The vessel being overtaken',
      'The overtaking vessel',
      'The slower vessel',
      'The vessel on the port side',
    ],
    correctAnswer: 'The overtaking vessel',
    explanation:
      'Rule 13: Any vessel overtaking any other shall keep out of the way of the vessel being overtaken.',
  },
  {
    id: 'vh-07',
    category: 'vessel-hierarchy',
    prompt: 'What is the stand-on vessel\'s primary obligation when a risk of collision exists?',
    options: [
      'Take immediate avoiding action',
      'Maintain course and speed',
      'Sound five short blasts',
      'Reduce speed to bare steerageway',
    ],
    correctAnswer: 'Maintain course and speed',
    explanation:
      'Rule 17: The stand-on vessel shall keep her course and speed, allowing the give-way vessel to take early and substantial action.',
  },
  {
    id: 'vh-08',
    category: 'vessel-hierarchy',
    prompt: 'Under Rule 17, a stand-on vessel MAY take action when:',
    options: [
      'She determines a risk of collision exists',
      'The give-way vessel has not taken sufficient action and collision appears imminent',
      'She is in a narrow channel',
      'Visibility drops below 0.5 nautical miles',
    ],
    correctAnswer: 'The give-way vessel has not taken sufficient action and collision appears imminent',
    explanation:
      'Rule 17(a)(ii) and 17(b): The stand-on vessel may act when it becomes apparent that the give-way vessel is not taking appropriate action. She SHALL act when collision cannot be avoided by the give-way vessel alone.',
  },
  {
    id: 'vh-09',
    category: 'vessel-hierarchy',
    prompt: 'A vessel engaged in fishing (with gear deployed) has priority over which of the following?',
    options: [
      'A vessel not under command',
      'A vessel restricted in ability to maneuver',
      'A sailing vessel',
      'A vessel constrained by her draft',
    ],
    correctAnswer: 'A sailing vessel',
    explanation:
      'Rule 18: A vessel engaged in fishing shall keep out of the way of NUC and RAM vessels but has priority over sailing vessels and power-driven vessels.',
  },
  {
    id: 'vh-10',
    category: 'vessel-hierarchy',
    prompt: 'Which rule governs responsibilities between vessels and defines the hierarchy of give-way obligations?',
    options: ['Rule 13', 'Rule 15', 'Rule 18', 'Rule 21'],
    correctAnswer: 'Rule 18',
    explanation:
      'Rule 18 ("Responsibilities between vessels") defines the full hierarchy: NUC > RAM > CBD > Fishing > Sailing > Power-driven > Seaplanes.',
  },
  {
    id: 'vh-11',
    category: 'vessel-hierarchy',
    prompt: 'Two sailing vessels are approaching with the wind on different sides. Which one keeps out of the way?',
    options: [
      'The vessel which has the wind on her port side',
      'The vessel which has the wind on her starboard side',
      'The windward vessel',
      'The faster vessel',
    ],
    correctAnswer: 'The vessel which has the wind on her port side',
    explanation:
      'Rule 12(a)(i): When each sailing vessel has the wind on a different side, the one with the wind on her port side keeps out of the way of the other.',
  },
  {
    id: 'vh-12',
    category: 'vessel-hierarchy',
    prompt: 'Two sailing vessels have the wind on the same side. Which one keeps out of the way?',
    options: [
      'The vessel to windward',
      'The vessel to leeward',
      'The vessel on the port tack',
      'The overtaking vessel only',
    ],
    correctAnswer: 'The vessel to windward',
    explanation:
      'Rule 12(a)(ii): When both sailing vessels have the wind on the same side, the vessel to windward keeps out of the way of the vessel to leeward.',
  },
  {
    id: 'vh-13',
    category: 'vessel-hierarchy',
    prompt: 'What is required of the vessel BEING overtaken?',
    options: [
      'Maintain course and speed as the stand-on vessel',
      'Alter course to starboard to open the range',
      'Reduce speed to let the other vessel past',
      'Sound two short blasts and give way',
    ],
    correctAnswer: 'Maintain course and speed as the stand-on vessel',
    explanation:
      'Rules 13 and 17: The overtaking vessel keeps out of the way; the vessel being overtaken is the stand-on vessel and keeps her course and speed. A subsequent change of bearing does not relieve the overtaking vessel of that duty.',
  },
  {
    id: 'vh-14',
    category: 'vessel-hierarchy',
    prompt: 'In a narrow channel, a vessel of less than 20 metres or a sailing vessel must not do what?',
    options: [
      'Impede the passage of a vessel that can navigate only within the channel',
      'Overtake any vessel under any circumstances',
      'Anchor anywhere within five miles of the channel',
      'Cross the channel at any time',
    ],
    correctAnswer: 'Impede the passage of a vessel that can navigate only within the channel',
    explanation:
      'Rule 9(b): A vessel of less than 20 metres in length or a sailing vessel shall not impede the passage of a vessel which can safely navigate only within a narrow channel or fairway.',
  },
  {
    id: 'vh-15',
    category: 'vessel-hierarchy',
    prompt: 'A vessel engaged in fishing in a narrow channel must not impede whom?',
    options: [
      'Any other vessel navigating within the channel',
      'Only vessels constrained by their draft',
      'Only power-driven vessels over 50 metres',
      'Nobody - fishing vessels have right of way in channels',
    ],
    correctAnswer: 'Any other vessel navigating within the channel',
    explanation:
      'Rule 9(c): A vessel engaged in fishing shall not impede the passage of any other vessel navigating within a narrow channel or fairway. Her Rule 18 priority does not carry into the channel.',
  },
  {
    id: 'vh-16',
    category: 'vessel-hierarchy',
    prompt: 'In a traffic separation scheme, a sailing vessel or a vessel of less than 20 metres must not impede whom?',
    options: [
      'A power-driven vessel following a traffic lane',
      'Any vessel engaged in fishing',
      'Only vessels not under command',
      'Nobody - the scheme imposes no such duty',
    ],
    correctAnswer: 'A power-driven vessel following a traffic lane',
    explanation:
      'Rule 10(j): A vessel of less than 20 metres in length or a sailing vessel shall not impede the safe passage of a power-driven vessel following a traffic lane.',
  },
  {
    id: 'vh-17',
    category: 'vessel-hierarchy',
    prompt: 'A power-driven vessel underway must keep out of the way of which of these?',
    options: [
      'A vessel not under command, a RAM vessel, a fishing vessel and a sailing vessel',
      'A sailing vessel only',
      'A vessel not under command only',
      'Any vessel larger than herself',
    ],
    correctAnswer: 'A vessel not under command, a RAM vessel, a fishing vessel and a sailing vessel',
    explanation:
      'Rule 18(a): A power-driven vessel underway keeps out of the way of a vessel not under command, a vessel restricted in her ability to manoeuvre, a vessel engaged in fishing, and a sailing vessel. She sits near the bottom of the order of responsibility.',
  },
  {
    id: 'vh-18',
    category: 'vessel-hierarchy',
    prompt: 'Which vessel is the stand-on vessel between two vessels NOT in sight of one another in restricted visibility?',
    options: [
      'Neither - Rule 19 applies and there is no stand-on vessel',
      'The vessel with the other on her port side',
      'The larger vessel',
      'The vessel making the slower speed',
    ],
    correctAnswer: 'Neither - Rule 19 applies and there is no stand-on vessel',
    explanation:
      'Rule 19: The steering and sailing rules for vessels in sight of one another do not apply in restricted visibility. There is no stand-on vessel; every vessel proceeds at a safe speed and takes avoiding action in accordance with Rule 19(d).',
  },
  {
    id: 'vh-19',
    category: 'vessel-hierarchy',
    prompt: 'What is required of a seaplane on the water?',
    options: [
      'She shall keep well clear of all vessels and avoid impeding their navigation',
      'She is treated as a vessel not under command',
      'She has priority over power-driven vessels',
      'She is treated as a vessel restricted in her ability to manoeuvre',
    ],
    correctAnswer: 'She shall keep well clear of all vessels and avoid impeding their navigation',
    explanation:
      'Rule 18(e): A seaplane on the water shall in general keep well clear of all vessels and avoid impeding their navigation. She sits at the very bottom of the order of responsibility.',
  },
  {
    id: 'vh-20',
    category: 'vessel-hierarchy',
    prompt: 'Risk of collision shall be deemed to exist if which of these is true?',
    options: [
      'The compass bearing of an approaching vessel does not appreciably change',
      'The other vessel is within two miles',
      'The other vessel is closing at more than ten knots',
      'The other vessel is fine on the starboard bow',
    ],
    correctAnswer: 'The compass bearing of an approaching vessel does not appreciably change',
    explanation:
      'Rule 7(d)(i): Risk of collision shall be deemed to exist if the compass bearing of an approaching vessel does not appreciably change. Rule 7(d)(ii) warns that risk may exist even with an appreciable bearing change, as with a very large vessel or a tow at close range.',
  },
];

// --- DAY SHAPES (16 questions) ---

const dayShapesQuestions: ColregsQuestion[] = [
  {
    id: 'ds-01',
    category: 'day-shapes',
    prompt: 'What day shape does a vessel at anchor display?',
    options: [
      'One black ball',
      'Two black balls in a vertical line',
      'One black diamond',
      'One black cone',
    ],
    correctAnswer: 'One black ball',
    explanation:
      'Rule 30: A vessel at anchor displays one black ball in the forepart of the vessel where best seen.',
  },
  {
    id: 'ds-02',
    category: 'day-shapes',
    prompt: 'What day shape does a vessel not under command display?',
    options: [
      'One black ball',
      'Two black balls in a vertical line',
      'One black diamond',
      'Three black balls in a vertical line',
    ],
    correctAnswer: 'Two black balls in a vertical line',
    explanation:
      'Rule 27: A vessel not under command displays two black balls in a vertical line where best seen.',
  },
  {
    id: 'ds-03',
    category: 'day-shapes',
    prompt: 'A sailing vessel proceeding under sail AND being propelled by machinery must display which day shape?',
    options: [
      'One black ball',
      'One black cone, apex downwards',
      'One black diamond',
      'Two black balls',
    ],
    correctAnswer: 'One black cone, apex downwards',
    explanation:
      'Rule 25: A vessel proceeding under sail when also being propelled by machinery shall exhibit forward a black conical shape, apex downwards. (If only sailing, no day shape is required.)',
  },
  {
    id: 'ds-04',
    category: 'day-shapes',
    prompt: 'What day shape does a vessel engaged in towing display when the tow exceeds 200 metres?',
    options: [
      'One black diamond',
      'Two black diamonds in a vertical line',
      'One black ball',
      'A diamond shape where the tow length is marked',
    ],
    correctAnswer: 'One black diamond',
    explanation:
      'Rule 24: When the length of the tow exceeds 200 metres, both the towing vessel and the towed vessel each display a black diamond shape where best seen.',
  },
  {
    id: 'ds-05',
    category: 'day-shapes',
    prompt: 'A vessel restricted in ability to maneuver (RAM) displays which day shape?',
    options: [
      'Ball-diamond-ball in a vertical line',
      'Diamond-ball-diamond in a vertical line',
      'Three black balls in a vertical line',
      'One black cylinder',
    ],
    correctAnswer: 'Ball-diamond-ball in a vertical line',
    explanation:
      'Rule 27: A RAM vessel displays a ball, diamond, and ball in a vertical line where best seen (black shapes).',
  },
  {
    id: 'ds-06',
    category: 'day-shapes',
    prompt: 'A vessel constrained by her draft may display which day shape?',
    options: [
      'One black ball',
      'One black cylinder',
      'Three black balls in a vertical line',
      'Ball-diamond-ball in a vertical line',
    ],
    correctAnswer: 'One black cylinder',
    explanation:
      'Rule 28: A vessel constrained by her draft may exhibit a cylinder (black) where best seen.',
  },
  {
    id: 'ds-07',
    category: 'day-shapes',
    prompt: 'A vessel aground displays which day shape?',
    options: [
      'One black ball',
      'Two black balls in a vertical line',
      'Three black balls in a vertical line',
      'One black cylinder',
    ],
    correctAnswer: 'Three black balls in a vertical line',
    explanation:
      'Rule 30: A vessel aground displays three black balls in a vertical line where best seen.',
  },
  {
    id: 'ds-08',
    category: 'day-shapes',
    prompt: 'A vessel engaged in minesweeping displays, in addition to her steaming lights or shapes, how many black balls?',
    options: ['One', 'Two', 'Three', 'Four'],
    correctAnswer: 'Three',
    explanation:
      'Rule 27: A vessel engaged in minesweeping displays three black balls — one at or near the foremast head and one at each end of the fore yardarm — to indicate that it is dangerous to approach within 1000 metres.',
  },
  {
    id: 'ds-09',
    category: 'day-shapes',
    prompt: 'What day shape does a vessel engaged in fishing display?',
    options: [
      'Two cones with their apexes together, in a vertical line',
      'Two black balls in a vertical line',
      'One black cone, apex downwards',
      'A ball, a diamond and a ball in a vertical line',
    ],
    correctAnswer: 'Two cones with their apexes together, in a vertical line',
    explanation:
      'Rule 26(b)(i): A vessel engaged in fishing displays two cones with their apexes together in a vertical line - the daytime equivalent of her green-over-white or red-over-white lights.',
  },
  {
    id: 'ds-10',
    category: 'day-shapes',
    prompt: 'A fishing vessel with outlying gear extending more than 150 metres horizontally displays what additional shape?',
    options: [
      'A cone, apex upwards, in the direction of the gear',
      'A second pair of cones, apexes together',
      'A black diamond on the side of the gear',
      'Two black balls on the side of the gear',
    ],
    correctAnswer: 'A cone, apex upwards, in the direction of the gear',
    explanation:
      'Rule 26(c)(ii): A vessel engaged in fishing with outlying gear extending more than 150 metres horizontally displays a cone, apex upwards, in the direction of the gear, so others know which side to avoid.',
  },
  {
    id: 'ds-11',
    category: 'day-shapes',
    prompt: 'What day shape is displayed by the vessel BEING TOWED, when the tow exceeds 200 metres?',
    options: [
      'One black diamond',
      'One black ball',
      'Two black balls in a vertical line',
      'None - only the towing vessel displays a shape',
    ],
    correctAnswer: 'One black diamond',
    explanation:
      'Rule 24(e)(iii): A vessel being towed displays a diamond shape when the length of the tow exceeds 200 metres. Both ends of the tow carry the diamond - the towing vessel under Rule 24(a)(v) and the towed vessel under 24(e)(iii).',
  },
  {
    id: 'ds-12',
    category: 'day-shapes',
    prompt: 'Which vessel at anchor is NOT required to exhibit the anchor ball?',
    options: [
      'A vessel of less than 7 metres, not in or near a narrow channel, fairway or anchorage',
      'Any vessel of less than 20 metres, anywhere',
      'Any vessel of less than 50 metres, anywhere',
      'Every vessel at anchor must exhibit it without exception',
    ],
    correctAnswer: 'A vessel of less than 7 metres, not in or near a narrow channel, fairway or anchorage',
    explanation:
      'Rule 30(g): A vessel of less than 7 metres in length, when at anchor and not in or near a narrow channel, fairway or anchorage, or where other vessels normally navigate, is not required to exhibit the anchor light or shape.',
  },
  {
    id: 'ds-13',
    category: 'day-shapes',
    prompt: 'Which vessel aground is NOT required to exhibit the three balls?',
    options: [
      'A vessel of less than 12 metres in length',
      'A vessel of less than 20 metres in length',
      'A vessel of less than 50 metres in length',
      'Every vessel aground must exhibit them without exception',
    ],
    correctAnswer: 'A vessel of less than 12 metres in length',
    explanation:
      'Rule 30(f): A vessel of less than 12 metres in length, when aground, is not required to exhibit the three balls in a vertical line required by Rule 30(d).',
  },
  {
    id: 'ds-14',
    category: 'day-shapes',
    prompt: 'Where on the vessel is the anchor ball displayed?',
    options: [
      'In the fore part',
      'At or near the stern',
      'At the masthead, amidships',
      'On the side facing the channel',
    ],
    correctAnswer: 'In the fore part',
    explanation:
      'Rule 30(a)(i): A vessel at anchor exhibits, where it can best be seen, one ball in the fore part - marking the end she is riding to her anchor from.',
  },
  {
    id: 'ds-15',
    category: 'day-shapes',
    prompt: 'What day shape does a sailing vessel proceeding under sail alone display?',
    options: [
      'None',
      'One black cone, apex downwards',
      'One black ball',
      'Two cones with their apexes together',
    ],
    correctAnswer: 'None',
    explanation:
      'Rule 25: A sailing vessel proceeding under sail alone carries no day shape. The cone apex downwards of Rule 25(e) is required only when she is under sail AND being propelled by machinery, when she counts as a power-driven vessel.',
  },
  {
    id: 'ds-16',
    category: 'day-shapes',
    prompt: 'Under Annex I, what is the minimum diameter of a ball shape on a vessel of 20 metres or more?',
    options: ['0.6 metres', '0.3 metres', '1.0 metres', '1.5 metres'],
    correctAnswer: '0.6 metres',
    explanation:
      'Annex I, section 6: A ball shall have a diameter of not less than 0.6 metres, and where more than one shape is shown they shall be spaced at least 1.5 metres apart. Vessels of less than 20 metres may use correspondingly smaller shapes.',
  },
];

// --- VESSEL TYPES (6 questions) ---
//
// Identify the vessel from what she is showing, with no text label naming the
// type. Each cue is a real COLREGS signal - see VesselProfile.tsx. A
// power-driven vessel is deliberately not asked: underway she carries no day
// shape, so there is nothing to draw that would distinguish her.

const vesselTypesQuestions: ColregsQuestion[] = [
  {
    id: 'vt-01',
    category: 'vessel-types',
    prompt: 'This vessel is showing two black balls in a vertical line. What is she?',
    options: [
      'A vessel not under command',
      'A vessel restricted in her ability to manoeuvre',
      'A vessel at anchor',
      'A vessel aground',
    ],
    correctAnswer: 'A vessel not under command',
    explanation:
      'Rule 27(a)(ii): A vessel not under command displays two black balls in a vertical line. She is unable to manoeuvre through some exceptional circumstance, and every other vessel keeps clear of her.',
  },
  {
    id: 'vt-02',
    category: 'vessel-types',
    prompt: 'This vessel displays a ball, a diamond and a ball in a vertical line. What is she?',
    options: [
      'A vessel restricted in her ability to manoeuvre',
      'A vessel not under command',
      'A vessel constrained by her draft',
      'A vessel engaged in fishing',
    ],
    correctAnswer: 'A vessel restricted in her ability to manoeuvre',
    explanation:
      'Rule 27(b)(ii): A vessel restricted in her ability to manoeuvre displays three shapes in a vertical line - ball, diamond, ball. The work she is engaged in, such as dredging or laying cable, prevents her from keeping out of the way.',
  },
  {
    id: 'vt-03',
    category: 'vessel-types',
    prompt: 'This vessel displays a single black cylinder. What is she?',
    options: [
      'A vessel constrained by her draft',
      'A vessel restricted in her ability to manoeuvre',
      'A vessel engaged in towing',
      'A vessel not under command',
    ],
    correctAnswer: 'A vessel constrained by her draft',
    explanation:
      'Rule 28: A vessel constrained by her draft may display a cylinder. Her draft in relation to the depth and width of navigable water severely restricts her ability to deviate from her course.',
  },
  {
    id: 'vt-04',
    category: 'vessel-types',
    prompt: 'This vessel displays two cones with their apexes together, and has gear streaming astern. What is she?',
    options: [
      'A vessel engaged in fishing',
      'A vessel restricted in her ability to manoeuvre',
      'A vessel engaged in dredging',
      'A vessel constrained by her draft',
    ],
    correctAnswer: 'A vessel engaged in fishing',
    explanation:
      'Rule 26(b)(i): A vessel engaged in fishing displays two cones with their apexes together in a vertical line. Rule 26(c)(ii) adds a cone pointing towards outlying gear extending more than 150 metres horizontally.',
  },
  {
    id: 'vt-05',
    category: 'vessel-types',
    prompt: 'This vessel is under sail and carries no day shape at all. What is she?',
    options: [
      'A sailing vessel under sail alone',
      'A sailing vessel under sail and machinery',
      'A vessel not under command',
      'A vessel engaged in fishing',
    ],
    correctAnswer: 'A sailing vessel under sail alone',
    explanation:
      'Rule 25: A sailing vessel proceeding under sail alone carries no day shape. It is only when she is under sail AND being propelled by machinery that Rule 25(e) requires a cone, apex downwards - she is then treated as a power-driven vessel.',
  },
  {
    id: 'vt-06',
    category: 'vessel-types',
    prompt: 'This vessel displays a single black diamond and has another vessel on a towline astern. What is she?',
    options: [
      'A vessel towing, where the length of the tow exceeds 200 metres',
      'A vessel restricted in her ability to manoeuvre',
      'A vessel constrained by her draft',
      'A vessel engaged in fishing',
    ],
    correctAnswer: 'A vessel towing, where the length of the tow exceeds 200 metres',
    explanation:
      'Rule 24(a)(v): When the length of the tow, measured from the stern of the towing vessel to the after end of the tow, exceeds 200 metres, a diamond shape is displayed. Rule 24(e)(iii) requires the towed vessel to display one as well.',
  },
];

// --- ANCHOR TYPES (13 questions) ---
//
// Seamanship, not COLREGS: no rule governs which anchor you carry, so these
// explanations open with a topic label from SEAMANSHIP_LABELS instead of a
// rule citation. See the note beside NON_COLREGS_CATEGORIES above.
//
// Every type here has a generic name and a trademarked one in real use, and
// both are heard on a dock. The generic term is always the correct answer -
// grading on "Danforth" would mark a candidate wrong for the more formal word -
// and the explanation names the trade name so neither reads as an error.

const anchorTypesQuestions: ColregsQuestion[] = [
  {
    id: 'an-01',
    category: 'anchor-types',
    prompt:
      'This anchor has two broad flat plates hinged at the crown, with a stock laid across it. What type is it?',
    options: ['Fluke anchor', 'Plow anchor', 'Claw anchor', 'Mushroom anchor'],
    correctAnswer: 'Fluke anchor',
    explanation:
      'Ground tackle: The fluke anchor - sold most widely as the Danforth - is built from two broad flat plates hinged at the crown, with a stock across the crown to roll those plates down into the bottom. The large plate area is what gives it its holding power.',
  },
  {
    id: 'an-02',
    category: 'anchor-types',
    prompt:
      'This anchor carries a single plowshare on the end of its shank, two wings rising to either side of one point. What type is it?',
    options: ['Plow anchor', 'Fluke anchor', 'Grapnel', 'Claw anchor'],
    correctAnswer: 'Plow anchor',
    explanation:
      'Ground tackle: The plow anchor is named for the plowshare on the end of the shank, which cuts in and buries the way a plough turns soil. The two long-running patterns are the CQR and the Delta; both are plows, and both are known by their trade names as often as by the generic one.',
  },
  {
    id: 'an-03',
    category: 'anchor-types',
    prompt:
      'This anchor is a single casting with three heavy curved tines off one crown, a short shank and no stock. What type is it?',
    options: ['Claw anchor', 'Fluke anchor', 'Plow anchor', 'Mushroom anchor'],
    correctAnswer: 'Claw anchor',
    explanation:
      'Ground tackle: The claw anchor - usually called a Bruce, after the original maker - is cast in one piece with three curved tines, no stock and no hinge. It sets quickly and at almost any angle of approach, which is what earned it its place as a bower.',
  },
  {
    id: 'an-04',
    category: 'anchor-types',
    prompt:
      'This anchor has several thin hooked tines spaced around a long bare shaft. What type is it?',
    options: ['Grapnel', 'Claw anchor', 'Fluke anchor', 'Plow anchor'],
    correctAnswer: 'Grapnel',
    explanation:
      'Ground tackle: The grapnel carries multiple curved tines around a central shaft and holds by hooking onto something rather than by burying itself. It is small-craft gear - dinghies, tenders and kayaks - and folding patterns are made to stow flat.',
  },
  {
    id: 'an-05',
    category: 'anchor-types',
    prompt:
      'This anchor is an inverted bowl on a plain shank, with no fluke, point or tine anywhere on it. What type is it?',
    options: ['Mushroom anchor', 'Claw anchor', 'Plow anchor', 'Grapnel'],
    correctAnswer: 'Mushroom anchor',
    explanation:
      'Ground tackle: The mushroom anchor has nothing on it that can dig in. It holds by its own weight and by silting gradually into a soft bottom over weeks and months, which is why it is laid for permanent moorings rather than carried as working gear.',
  },
  {
    id: 'an-06',
    category: 'anchor-types',
    prompt:
      'You are anchoring on a firm sand bottom and want the most holding power you can get for the weight of gear you are able to handle. Which type is the strongest choice?',
    options: ['Fluke anchor', 'Grapnel', 'Mushroom anchor', 'Claw anchor'],
    correctAnswer: 'Fluke anchor',
    explanation:
      'Holding ground: The fluke anchor (Danforth) gives the highest holding power for its weight of the common types in sand and mud, because once buried its two wide plates present a large area against the pull. That advantage belongs to bottoms it can dig into and nowhere else.',
  },
  {
    id: 'an-07',
    category: 'anchor-types',
    prompt: 'A fluke anchor is at its best in sand and mud. On which bottom is it least reliable?',
    options: ['Rock', 'Soft mud', 'Firm sand', 'Silt'],
    correctAnswer: 'Rock',
    explanation:
      'Holding ground: A fluke anchor holds by burying its plates, and on rock there is nothing to bury them in - it skates across, or jams by luck and then has to be broken out. A bottom like that wants an anchor that hooks instead of one that digs.',
  },
  {
    id: 'an-08',
    category: 'anchor-types',
    prompt:
      'You are lying to one anchor overnight and expect wind and tide to swing the boat right around. Which type is best known for resetting itself when the pull comes from a new direction?',
    options: ['Plow anchor', 'Grapnel', 'Mushroom anchor', 'Fluke anchor'],
    correctAnswer: 'Plow anchor',
    explanation:
      'Holding ground: The plow (CQR or Delta) is the type most trusted to reset through a shift: as the pull comes round, the share is dragged out and ploughs straight back in on the new heading. That behaviour, with good holding on most bottoms, is what makes it an all-round bower.',
  },
  {
    id: 'an-09',
    category: 'anchor-types',
    prompt: 'A plow anchor holds well on most bottoms. Which one is its known weak point?',
    options: ['Thick grass', 'Firm sand', 'Soft mud', 'Gravel'],
    correctAnswer: 'Thick grass',
    explanation:
      'Holding ground: Thick grass and weed are where the plow struggles - the share skids over the mat of vegetation instead of cutting through to the holding ground underneath. The claw has the same difficulty in heavy grass.',
  },
  {
    id: 'an-10',
    category: 'anchor-types',
    prompt: 'The CQR and the Delta are both plow anchors. What distinguishes one from the other?',
    options: [
      'The CQR has a hinged shank; the Delta\'s shank is fixed',
      'The CQR has two plowshares; the Delta has one',
      'The CQR is a stocked anchor; the Delta is stockless',
      'The CQR is cast in one piece; the Delta is hinged at the crown',
    ],
    correctAnswer: 'The CQR has a hinged shank; the Delta\'s shank is fixed',
    explanation:
      'Ground tackle: Both are plows and both are trade names. The CQR pivots on a hinge where the shank meets the share, which lets the share stay where it is as the boat swings above it; the Delta carries the same kind of share on a fixed shank. Calling either one a plow anchor is correct.',
  },
  {
    id: 'an-11',
    category: 'anchor-types',
    prompt:
      'Which type sets quickly at almost any angle of approach and is a dependable choice on rock and on mixed bottoms?',
    options: ['Claw anchor', 'Fluke anchor', 'Mushroom anchor', 'Plow anchor'],
    correctAnswer: 'Claw anchor',
    explanation:
      'Holding ground: The claw (Bruce) sets fast and handles rock and mixed bottoms well, its tines finding purchase where a burying anchor has nothing to bury into. Its weakness is the plow\'s weakness too: thick grass, which it slides over.',
  },
  {
    id: 'an-12',
    category: 'anchor-types',
    prompt:
      'A dinghy needs to anchor over a rocky, debris-strewn bottom where the anchor has to catch in a crevice rather than bury itself. Which type is made for that?',
    options: ['Grapnel', 'Fluke anchor', 'Mushroom anchor', 'Plow anchor'],
    correctAnswer: 'Grapnel',
    explanation:
      'Holding ground: The grapnel is the hooking anchor - its tines catch on rock, coral and debris, and it is sized for small craft. In sand or mud it is a poor choice: there is nothing to hook, and thin tines have no area to hold with. A claw also works on rock, but on a larger boat and by burying as well as catching.',
  },
  {
    id: 'an-13',
    category: 'anchor-types',
    prompt:
      'Why is a mushroom anchor unsuitable as the working anchor for an overnight stop?',
    options: [
      'It holds by weight and by silting in slowly, so it has little grip on the night it is dropped',
      'It sets so hard that it cannot be broken out again',
      'It can only be used on rock and coral bottoms',
      'It holds well but is too light to carry enough chain',
    ],
    correctAnswer:
      'It holds by weight and by silting in slowly, so it has little grip on the night it is dropped',
    explanation:
      'Ground tackle: A mushroom develops its hold as it settles and silts into a soft bottom, a process measured in weeks. Dropped fresh it is doing nothing but lying on the bottom under its own weight, so it belongs on a permanent mooring and not in the anchor locker.',
  },
];

// --- BUOYAGE (18 questions) ---
//
// Not COLREGS: the buoyage system is IALA's, and the ICW overlay on top of it
// is the US Coast Guard's, so these explanations open with a topic label from
// TOPIC_LABELS rather than a rule number. See NON_COLREGS_CATEGORIES above.
//
// Everything here is written for IALA Region B, the region the United States
// lies in, because that is the water this app is studied for. Region A is not
// footnoted into every answer - it is drilled head-on in the last two
// questions instead, which is where a boater who has chartered abroad needs
// it. The one thing that must never be blurred is which parts differ: the
// LATERAL marks reverse between the regions and nothing else does.
//
// A note on shapes. "Can" and "nun" are what a mark's shape is called on this
// coast; IALA writes them as cylindrical and conical. Both are accepted usage
// and the explanations name both, so a candidate who learned the formal words
// does not read the answer as wrong.

const buoyageQuestions: ColregsQuestion[] = [
  {
    id: 'by-01',
    category: 'buoyage',
    prompt:
      'Entering a channel from seaward in the United States, you see a flat-topped cylindrical buoy painted solid green. What is it?',
    options: [
      'A port-hand lateral mark',
      'A starboard-hand lateral mark',
      'A special mark',
      'A safe water mark',
    ],
    correctAnswer: 'A port-hand lateral mark',
    explanation:
      'IALA-B: A solid green can (cylindrical) buoy is the port-hand lateral mark of Region B - leave it to port when returning from seaward. It carries a green light if lit, and odd numbers that increase as you come upstream.',
  },
  {
    id: 'by-02',
    category: 'buoyage',
    prompt:
      'Entering a channel from seaward in the United States, you see a buoy that tapers to a blunt point at the top and is painted solid red. What is it?',
    options: [
      'A starboard-hand lateral mark',
      'A port-hand lateral mark',
      'An isolated danger mark',
      'A special mark',
    ],
    correctAnswer: 'A starboard-hand lateral mark',
    explanation:
      'IALA-B: A solid red nun (conical) buoy is the starboard-hand lateral mark of Region B - leave it to starboard when returning from seaward. Red light if lit, and even numbers that increase upstream.',
  },
  {
    id: 'by-03',
    category: 'buoyage',
    prompt: 'What does the phrase "red right returning" actually instruct you to do?',
    options: [
      'Keep the red marks on your starboard side when returning from seaward toward a harbour or upstream',
      'Keep the red marks on your starboard side whenever they are in sight, whichever way you are heading',
      'Keep the red marks on your port side when leaving a harbour for the sea',
      'Keep the red marks on your starboard side only in the Intracoastal Waterway',
    ],
    correctAnswer:
      'Keep the red marks on your starboard side when returning from seaward toward a harbour or upstream',
    explanation:
      'US ATON: The saying only works in the returning direction - coming in from sea, or going upstream. Head back out and every mark swaps sides, which is why the conventional direction of buoyage is defined for a waterway rather than left to the helmsman to guess.',
  },
  {
    id: 'by-04',
    category: 'buoyage',
    prompt:
      'A pillar buoy is painted black above yellow and carries two black cones one above the other, both pointing upward. What is it?',
    options: [
      'A north cardinal mark',
      'A south cardinal mark',
      'An east cardinal mark',
      'An isolated danger mark',
    ],
    correctAnswer: 'A north cardinal mark',
    explanation:
      'IALA-B: Two cones pointing up, black band above yellow, is the north cardinal. The cones point to the black: for north the black is on top, so the cones point up. Pass to the north of it - that is the side the safe water is on.',
  },
  {
    id: 'by-05',
    category: 'buoyage',
    prompt:
      'A pillar buoy is painted yellow above black and carries two black cones one above the other, both pointing downward. What is it?',
    options: [
      'A south cardinal mark',
      'A north cardinal mark',
      'A west cardinal mark',
      'A special mark',
    ],
    correctAnswer: 'A south cardinal mark',
    explanation:
      'IALA-B: Two cones pointing down, yellow band above black, is the south cardinal - the black band is at the bottom and the cones point to it. Safe water lies to the south of the mark.',
  },
  {
    id: 'by-06',
    category: 'buoyage',
    prompt:
      'A pillar buoy is painted black, yellow, black in horizontal bands and carries two black cones mounted base to base. What is it?',
    options: [
      'An east cardinal mark',
      'A west cardinal mark',
      'An isolated danger mark',
      'A north cardinal mark',
    ],
    correctAnswer: 'An east cardinal mark',
    explanation:
      'IALA-B: Cones base to base - the wide ends meeting, the outline of an egg - is the east cardinal, black with a single yellow band. Pass to the east of it. The old memory hook is that the shape between the cones is an E on its side.',
  },
  {
    id: 'by-07',
    category: 'buoyage',
    prompt:
      'A pillar buoy is painted yellow, black, yellow in horizontal bands and carries two black cones mounted point to point. What is it?',
    options: [
      'A west cardinal mark',
      'An east cardinal mark',
      'A south cardinal mark',
      'A safe water mark',
    ],
    correctAnswer: 'A west cardinal mark',
    explanation:
      'IALA-B: Cones point to point - the apexes meeting, the outline of a wine glass - is the west cardinal, yellow with a single black band. Pass to the west of it. "Wine glass for west" is the hook that survives an exam.',
  },
  {
    id: 'by-08',
    category: 'buoyage',
    prompt: 'What is a cardinal mark telling you?',
    options: [
      'The named side of the mark is where the safe water is',
      'The named side of the mark is where the danger is',
      'The mark lies on the named side of the channel',
      'The mark bears that direction from the harbour entrance',
    ],
    correctAnswer: 'The named side of the mark is where the safe water is',
    explanation:
      'IALA-B: A cardinal is named for the quadrant you should pass in, not for where the danger sits. A north cardinal means keep to the north of it - so the hazard is on the far side, to the south. Reading it the other way round puts you on the danger, which is why this is the question cardinals are failed on.',
  },
  {
    id: 'by-09',
    category: 'buoyage',
    prompt:
      'A buoy is painted black with one broad red horizontal band and carries two black spheres one above the other. What is it?',
    options: [
      'An isolated danger mark',
      'A north cardinal mark',
      'A safe water mark',
      'A starboard-hand lateral mark',
    ],
    correctAnswer: 'An isolated danger mark',
    explanation:
      'IALA-B: Black with one or more red bands, and two black spheres in a vertical line, is the isolated danger mark. The two spheres are its own topmark and belong to nothing else in the system.',
  },
  {
    id: 'by-10',
    category: 'buoyage',
    prompt: 'What does an isolated danger mark tell you about the water around it?',
    options: [
      'It is moored on or near a danger of limited extent that has navigable water all around it',
      'It marks the outer edge of a large shoal that must be given a wide berth on one side',
      'It marks the safe centre of a channel with danger on both sides',
      'It marks a wreck that has not yet been surveyed and has no safe side',
    ],
    correctAnswer:
      'It is moored on or near a danger of limited extent that has navigable water all around it',
    explanation:
      'IALA-B: The isolated danger mark is placed on or above a small, well-defined hazard - a rock, a wreck, a shoal patch - with clear water on every side of it. You can pass on any side; what you cannot do is run over the mark itself.',
  },
  {
    id: 'by-11',
    category: 'buoyage',
    prompt:
      'A buoy is painted in red and white vertical stripes and carries a single red sphere as a topmark. What is it?',
    options: [
      'A safe water mark',
      'An isolated danger mark',
      'A special mark',
      'A port-hand lateral mark',
    ],
    correctAnswer: 'A safe water mark',
    explanation:
      'IALA-B: Red and white VERTICAL stripes with a single red spherical topmark is the safe water mark - a fairway, mid-channel or landfall buoy, with navigable water all round it. The stripes running vertically are what separate it at a distance from the horizontal bands of a cardinal or an isolated danger.',
  },
  {
    id: 'by-12',
    category: 'buoyage',
    prompt:
      'A can buoy is painted solid yellow and carries a single yellow X-shaped topmark. What is it?',
    options: [
      'A special mark',
      'A safe water mark',
      'A port-hand lateral mark',
      'A cardinal mark',
    ],
    correctAnswer: 'A special mark',
    explanation:
      'IALA-B: All yellow, with a single yellow cross topmark if it carries one, is the special mark. Yellow belongs to no lateral or cardinal role in the system, which is what leaves it free for this one.',
  },
  {
    id: 'by-13',
    category: 'buoyage',
    prompt: 'What is a special mark there to indicate?',
    options: [
      'A special area or feature described in the chart or the Notices to Mariners, not a navigational channel side',
      'A hazard that is dangerous on every side and must not be approached',
      'The side of the channel you should pass on in a traffic separation scheme',
      'The point at which one buoyage region ends and the other begins',
    ],
    correctAnswer:
      'A special area or feature described in the chart or the Notices to Mariners, not a navigational channel side',
    explanation:
      'IALA-B: A special mark carries no navigational meaning of its own - it points at something written down elsewhere: a spoil ground, a cable or pipeline, a military exercise area, an anchorage, a recreation zone. The chart is what tells you which, so a special mark you cannot account for is a reason to look it up.',
  },
  {
    id: 'by-14',
    category: 'buoyage',
    prompt:
      'A buoy on the Intracoastal Waterway carries a yellow triangle painted on it. Which side do you leave it on, following the ICW in the conventional direction?',
    options: [
      'Your starboard side',
      'Your port side',
      'Either side - the triangle marks the channel centre',
      'Whichever side the buoy\'s own colour indicates',
    ],
    correctAnswer: 'Your starboard side',
    explanation:
      'US ATON: On the ICW a yellow TRIANGLE means starboard side, following the waterway in its conventional direction - southward along the Atlantic coast and westward along the Gulf. Triangle for starboard is the same pairing as the nun buoy, which is the way to remember it.',
  },
  {
    id: 'by-15',
    category: 'buoyage',
    prompt:
      'A buoy on the Intracoastal Waterway carries a yellow square painted on it. Which side do you leave it on, following the ICW in the conventional direction?',
    options: [
      'Your port side',
      'Your starboard side',
      'Either side - the square marks an anchorage',
      'Whichever side the buoy\'s own colour indicates',
    ],
    correctAnswer: 'Your port side',
    explanation:
      'US ATON: On the ICW a yellow SQUARE means port side, following the waterway in its conventional direction. Square for port pairs with the can buoy, the flat-topped one, the way the triangle pairs with the nun.',
  },
  {
    id: 'by-16',
    category: 'buoyage',
    prompt:
      'You are running the ICW and come to a red nun buoy with a yellow SQUARE painted on it. How do you pass it?',
    options: [
      'Leave it to port, because the yellow square governs while you are following the ICW',
      'Leave it to starboard, because a red nun is always left to starboard',
      'Leave it to starboard, because the yellow square applies only to unlit marks',
      'Either side - the two markings contradict each other, so the mark carries no instruction',
    ],
    correctAnswer:
      'Leave it to port, because the yellow square governs while you are following the ICW',
    explanation:
      'US ATON: Where the ICW runs along another marked waterway, a mark serves both, and the two can disagree. The yellow overlay is read on its own: square to port, triangle to starboard, whatever the hull under it is painted. It is exactly this case - a red buoy telling an ICW boat to pass it on the port side - that the yellow shapes exist for.',
  },
  {
    id: 'by-17',
    category: 'buoyage',
    prompt:
      'You have chartered in Europe, which buoys under IALA Region A. What is different there from the system used in the United States?',
    options: [
      'The lateral marks are reversed: red is left to port entering from seaward, and green to starboard',
      'The cardinal marks are reversed, and the lateral marks are the same',
      'The lateral marks are the same, but red and green lights swap meanings',
      'Nothing is reversed - only the numbering of the marks runs the other way',
    ],
    correctAnswer:
      'The lateral marks are reversed: red is left to port entering from seaward, and green to starboard',
    explanation:
      'IALA-B: The LATERAL marks are the whole of the difference between the two regions. In Region A - Europe, Africa, most of Asia and Australasia - red cans are left to port coming in and green cones to starboard, the exact reverse of the United States. "Red right returning" is a Region B saying and will put you on the bank in Region A.',
  },
  {
    id: 'by-18',
    category: 'buoyage',
    prompt:
      'Which marks mean exactly the same thing in IALA Region A as they do in IALA Region B?',
    options: [
      'Cardinal, isolated danger, safe water and special marks',
      'Lateral and cardinal marks',
      'Only the safe water mark',
      'None of them - the whole system is mirrored between the regions',
    ],
    correctAnswer: 'Cardinal, isolated danger, safe water and special marks',
    explanation:
      'IALA-B: Four of the five mark types are worldwide. A north cardinal is black over yellow with two cones up in every port on earth; so are the two black spheres of an isolated danger, the vertical red and white stripes of safe water, and the plain yellow of a special mark. Only the laterals change sides at the region boundary, which is why they are the ones to check on arrival.',
  },
];

// --- CHART SYMBOLS (17 questions) ---
//
// Not COLREGS either: these are read out of U.S. Chart No. 1, the NOAA and NGA
// publication of symbols, abbreviations and terms, so the explanations open
// with that label. See NON_COLREGS_CATEGORIES above.
//
// These questions carry NO diagram, and that is a decision rather than an
// omission. What is being tested is what a printed abbreviation stands for -
// "Iso", "PA", "Fl(2+1) R 6s" - and the abbreviation is already the picture.
// Drawing a chart extract around it would add scenery to a reading exercise
// and would have to invent a plausible piece of coastline to do it. The few
// entries that are genuinely graphic - the underlined sounding, the magenta
// flare - are described in words for the same reason: what a candidate has to
// carry to the chart table is the rule, not one rendering of it.
//
// The whole bank is written for US charts. Depth units are the case that
// matters: a NOAA chart may be in feet, fathoms or metres and says which in
// its title block, so no question here assumes one.

const chartSymbolsQuestions: ColregsQuestion[] = [
  {
    id: 'cs-01',
    category: 'chart-symbols',
    prompt: 'A lighted buoy on the chart is annotated "Fl G 4s". What does that describe?',
    options: [
      'A green light flashing once every 4 seconds',
      'A green light flashing 4 times in quick succession',
      'A green light visible for 4 nautical miles',
      'A green light 4 feet above the water',
    ],
    correctAnswer: 'A green light flashing once every 4 seconds',
    explanation:
      'Chart No. 1: A light description reads as character, colour, period, and then height and range where they are given. "Fl" is flashing, "G" is green, and "4s" is the period - the time for one complete cycle, so one flash every four seconds. Timing that period with a watch is how a light is identified at night.',
  },
  {
    id: 'cs-02',
    category: 'chart-symbols',
    prompt: 'What does the light character "Q" mean on a chart?',
    options: [
      'Quick flashing - a rapid, continuous flash of about 60 per minute',
      'Quenched - a light that has been reported extinguished',
      'Quarantine anchorage light',
      'A light whose character has not been established',
    ],
    correctAnswer: 'Quick flashing - a rapid, continuous flash of about 60 per minute',
    explanation:
      'Chart No. 1: "Q" is quick flashing, around 50 to 79 flashes a minute, and "VQ" is very quick, around 80 to 159. The quick rhythms belong mostly to cardinal marks, where the number of flashes in the group is what names the quadrant.',
  },
  {
    id: 'cs-03',
    category: 'chart-symbols',
    prompt: 'What does the light character "Iso" mean?',
    options: [
      'Isophase - equal periods of light and darkness',
      'Isolated - a light on a danger with clear water all round it',
      'A light of the same colour as the one before it in the sequence',
      'An intermittent light of no fixed period',
    ],
    correctAnswer: 'Isophase - equal periods of light and darkness',
    explanation:
      'Chart No. 1: Isophase means the light is on exactly as long as it is off. It is the middle of the three steady rhythms - flashing is mostly dark, occulting is mostly lit, isophase is even - and telling them apart by eye is what the period is timed for.',
  },
  {
    id: 'cs-04',
    category: 'chart-symbols',
    prompt: 'What does the light character "Occ" mean?',
    options: [
      'Occulting - the light is on longer than it is off',
      'Occulting - the light is off longer than it is on',
      'Occasional - a light exhibited only when shipping is expected',
      'A light obscured over part of its arc',
    ],
    correctAnswer: 'Occulting - the light is on longer than it is off',
    explanation:
      'Chart No. 1: An occulting light is a steady light interrupted by short eclipses - lit for longer than it is dark. It is the exact opposite of a flashing light, which is dark for longer than it is lit, and reversing the two is the commonest error on this page.',
  },
  {
    id: 'cs-05',
    category: 'chart-symbols',
    prompt: 'What does "F" mean when it opens a light description, as in "F R"?',
    options: [
      'Fixed - a steady light that does not flash at all',
      'Flashing, when no period is given',
      'Fog light, exhibited only in reduced visibility',
      'Floating - the light is on a buoy rather than a structure',
    ],
    correctAnswer: 'Fixed - a steady light that does not flash at all',
    explanation:
      'Chart No. 1: "F" is fixed - continuous and unchanging. "F R" is a fixed red light. Flashing is "Fl", with the l, and a fixed light with a flash worked into it is written "F Fl".',
  },
  {
    id: 'cs-06',
    category: 'chart-symbols',
    prompt: 'A buoy is charted as "Mo(A) W 8s". What is the light doing, and what kind of mark is it?',
    options: [
      'Flashing Morse code A - short then long - which is the light of a safe water mark',
      'Flashing Morse code A - long then short - which warns of an isolated danger',
      'Showing a single flash every 8 seconds, marking an anchorage',
      'Showing an alternating white light, marking the start of a traffic scheme',
    ],
    correctAnswer:
      'Flashing Morse code A - short then long - which is the light of a safe water mark',
    explanation:
      'Chart No. 1: "Mo(A)" is a light flashing the Morse letter A, a short flash followed by a long one, repeating every 8 seconds here. That rhythm belongs to the safe water mark - the red and white striped fairway, mid-channel and landfall buoys - so hearing it described is enough to name the mark.',
  },
  {
    id: 'cs-07',
    category: 'chart-symbols',
    prompt: 'A buoy is charted as "Fl(2+1) R 6s". What does the (2+1) grouping tell you?',
    options: [
      'It is a composite group flashing light, the character of a preferred-channel junction mark',
      'It flashes twice, then once more only in reduced visibility',
      'It carries two lights on one structure, one of them a spare',
      'It flashes three times every 6 seconds with no significance to the grouping',
    ],
    correctAnswer:
      'It is a composite group flashing light, the character of a preferred-channel junction mark',
    explanation:
      'Chart No. 1: A composite group - two flashes, a pause, then one - is the rhythm reserved for preferred-channel marks, the red-and-green banded buoys at a junction. The colour of the light matches the colour of the topmost band, which is the band that says which channel is the main one.',
  },
  {
    id: 'cs-08',
    category: 'chart-symbols',
    prompt: 'A sounding on the chart is annotated "Cy". What is the bottom there?',
    options: ['Clay', 'Coral', 'Cobbles', 'Chalk'],
    correctAnswer: 'Clay',
    explanation:
      'Chart No. 1: "Cy" is clay. The nature-of-the-bottom abbreviations are what an anchorage is chosen on, and the short ones are worth knowing cold: S sand, M mud, Rk rock, Sh shells, G gravel, Wd weed.',
  },
  {
    id: 'cs-09',
    category: 'chart-symbols',
    prompt:
      'You are looking for somewhere to anchor and the soundings in the bay are annotated "Co". Why is that a poor choice of berth?',
    options: [
      'Co is coral - a bottom that holds badly, cuts rode, and is damaged by anchoring',
      'Co is cobbles - the anchor will bury too deep to break out again',
      'Co is a cable area, where anchoring is prohibited',
      'Co is a coastguard zone, closed to anchoring without permission',
    ],
    correctAnswer:
      'Co is coral - a bottom that holds badly, cuts rode, and is damaged by anchoring',
    explanation:
      'Chart No. 1: "Co" is coral. A submarine cable area is charted as its own symbol with the word spelled out, not as this abbreviation. Coral gives an anchor little to bite, chafes through rode, and anchoring on it is restricted or banned in much of the water it is found in.',
  },
  {
    id: 'cs-10',
    category: 'chart-symbols',
    prompt: 'A figure on the chart is printed underlined, as "3". What does the underline mean?',
    options: [
      'It is a drying height - the feature uncovers at low water, and the figure is how far it stands above chart datum',
      'It is a sounding taken from an older survey and not since confirmed',
      'It is a charted depth that has been reported as shoaler than shown',
      'It is a height above mean high water rather than above chart datum',
    ],
    correctAnswer:
      'It is a drying height - the feature uncovers at low water, and the figure is how far it stands above chart datum',
    explanation:
      'Chart No. 1: An underlined figure is a drying height, not a depth. The ground it sits on is covered and uncovered by the tide, and the number is how far it dries ABOVE chart datum - so the water over it is the height of tide minus that figure, and at datum there is none.',
  },
  {
    id: 'cs-11',
    category: 'chart-symbols',
    prompt: 'How do you know whether the soundings on a chart are in feet, fathoms or metres?',
    options: [
      'The chart says so in its title block, and often in the margin as well',
      'All charts issued for United States waters are in feet',
      'All charts issued since the 1980s are in metres',
      'It is inferred from the scale - large-scale charts are in feet, small-scale in fathoms',
    ],
    correctAnswer: 'The chart says so in its title block, and often in the margin as well',
    explanation:
      'Chart No. 1: The unit of depth is stated on the chart itself, in the title block, and it varies from chart to chart in US waters - feet, fathoms, and metres are all in issue. Assuming the unit rather than reading it is how a fathoms chart gets navigated as though it were feet.',
  },
  {
    id: 'cs-12',
    category: 'chart-symbols',
    prompt: 'A charted rock carries the note "PA". What is being said?',
    options: [
      'Position approximate - the feature exists, but where it is shown cannot be relied on',
      'Position accurate - the feature has been fixed by a recent survey',
      'Partly awash - the rock covers and uncovers with the tide',
      'Prohibited anchorage in the area around it',
    ],
    correctAnswer:
      'Position approximate - the feature exists, but where it is shown cannot be relied on',
    explanation:
      'Chart No. 1: "PA" is position approximate. Its neighbours on the page are "PD", position doubtful, and "ED", existence doubtful, where even whether the thing is there is unsettled. All three are reasons to give a wide berth rather than to pass close on the charted position.',
  },
  {
    id: 'cs-13',
    category: 'chart-symbols',
    prompt: 'What does the abbreviation "Wk" mark?',
    options: [
      'A wreck',
      'A weed-covered bottom',
      'A working area, such as a dredging operation',
      'A wharf',
    ],
    correctAnswer: 'A wreck',
    explanation:
      'Chart No. 1: "Wk" is a wreck. Which wreck symbol it is drawn with says how much water is over it - a dangerous wreck, a wreck with a known depth over it, or a hull showing - and the sounding beside it, where there is one, is the least depth found over the wreck itself.',
  },
  {
    id: 'cs-14',
    category: 'chart-symbols',
    prompt: 'An aid to navigation is charted as "Bn". What kind of aid is it?',
    options: [
      'A beacon - a fixed aid built on the bottom or on shore, not a floating one',
      'A bell buoy, which sounds on the swell',
      'A bearing line printed on the chart for a range',
      'A basin marker at the entrance to a harbour',
    ],
    correctAnswer: 'A beacon - a fixed aid built on the bottom or on shore, not a floating one',
    explanation:
      'Chart No. 1: "Bn" is a beacon, a fixed structure. The distinction from a buoy is the one that matters to a piloting fix: a beacon does not move, so a bearing on it is worth taking, where a buoy can drag, drift off station, or be shifted without notice.',
  },
  {
    id: 'cs-15',
    category: 'chart-symbols',
    prompt: 'A magenta circle on the chart is labelled "Racon(B)". What is at that spot?',
    options: [
      'A radar transponder beacon, which paints the Morse letter B outward from its position on your radar',
      'A radio beacon transmitting the letter B for direction finding',
      'A radar reflector fitted to an unlit buoy',
      'A reporting point where traffic calls in on VHF',
    ],
    correctAnswer:
      'A radar transponder beacon, which paints the Morse letter B outward from its position on your radar',
    explanation:
      'Chart No. 1: A racon answers your radar pulse, so a coded flash - here Morse B, long-short-short-short - appears on the screen as a line running outward from the racon along its bearing. It is what makes a bridge pier or a landfall buoy identifiable on radar in poor visibility.',
  },
  {
    id: 'cs-16',
    category: 'chart-symbols',
    prompt: 'Lights, buoy light flares, restricted areas and recommended tracks are all printed in magenta. Why that colour?',
    options: [
      'It is the colour reserved for information the mariner must not miss, and it stays readable under a red night light',
      'It is the colour reserved for features added since the chart was first printed',
      'It marks everything that is privately maintained rather than federally maintained',
      'It marks everything whose position is approximate',
    ],
    correctAnswer:
      'It is the colour reserved for information the mariner must not miss, and it stays readable under a red night light',
    explanation:
      'Chart No. 1: Magenta is the chart\'s emphasis colour - lights and their flares, radar beacons, restricted and prohibited areas, recommended tracks and traffic schemes. It was chosen because it survives being read under the red light of a darkened wheelhouse, where an ordinary red print would vanish into the paper.',
  },
  {
    id: 'cs-17',
    category: 'chart-symbols',
    prompt: 'What is "U.S. Chart No. 1"?',
    options: [
      'The NOAA and NGA publication listing the symbols, abbreviations and terms used on US charts',
      'The largest-scale chart of the approaches to New York, the first ever issued by NOAA',
      'The index chart from which all other US chart numbers are allocated',
      'The Coast Guard publication listing every lighted aid to navigation in US waters',
    ],
    correctAnswer:
      'The NOAA and NGA publication listing the symbols, abbreviations and terms used on US charts',
    explanation:
      'Chart No. 1: Despite the name it is a booklet, not a chart - the joint NOAA and NGA key to every symbol, abbreviation and term used on paper and electronic navigational charts. The lighted aids in a region are listed in the Coast Guard\'s Light List instead, which is a different book for a different question.',
  },
];

// --- DISTRESS SIGNALS (16 questions) ---
//
// These ARE COLREGS. Annex IV to the 1972 Convention is headed "Distress
// Signals" and lists them, and Rule 37 is the rule that sends a vessel in
// distress to that list. So this category goes through the ordinary citation
// path with every other governed one - "Annex IV:" opens the explanations that
// are about what a signal means, and "Rule 37" opens the one that is about the
// obligation to use them. It is NOT in NON_COLREGS_CATEGORIES and must not be
// given a topic label: there is a real citation here, and inventing a label
// where a citation exists is the same error as inventing a citation where one
// does not.
//
// Colour is doing work in this category that shape does elsewhere. Red is what
// makes a flare a distress signal and orange is what makes the smoke one, so a
// question that asks what colour the signal must be gets no diagram - the
// diagram would be the answer. See QUESTION_DISTRESS in ../index.tsx.

const distressSignalsQuestions: ColregsQuestion[] = [
  {
    id: 'di-01',
    category: 'distress-signals',
    prompt:
      'You see a bright red light burning as it descends slowly beneath a small canopy. What are you looking at?',
    options: [
      'A rocket parachute flare - a distress signal',
      'A white anti-collision flare, warning you that you have not been seen',
      'A flare used to mark a position for a helicopter, carrying no distress meaning',
      'A signal that the vessel is engaged in fishing with gear out',
    ],
    correctAnswer: 'A rocket parachute flare - a distress signal',
    explanation:
      'Annex IV: A rocket parachute flare showing a red light is a listed distress signal. Fired to around 300 metres and hanging under its canopy for close to a minute, it is the signal meant to be seen from beyond the horizon, which is why it is the one fired first when help is not already in sight.',
  },
  {
    id: 'di-02',
    category: 'distress-signals',
    prompt:
      'A person on the deck of a small boat is holding up a burning red light at the end of a short case. What are they signalling?',
    options: [
      'Distress - a hand flare showing a red light',
      'That the vessel is under sail and about to alter course',
      'That the vessel is on pilotage duty and has a pilot aboard',
      'That the vessel is anchored and showing a temporary light',
    ],
    correctAnswer: 'Distress - a hand flare showing a red light',
    explanation:
      'Annex IV: A hand flare showing a red light is listed alongside the rocket parachute flare. It burns for about a minute and is seen only a few miles, so it is the one held back until a searching vessel or aircraft is close enough to fix your position by it.',
  },
  {
    id: 'di-03',
    category: 'distress-signals',
    prompt: 'A dense orange plume is rising from a small canister floating on the water. What is it?',
    options: [
      'A distress signal - a smoke signal giving off orange-coloured smoke',
      'A marker showing the boundary of an area closed to navigation',
      'A signal that the vessel nearby is engaged in dredging',
      'A signal that the vessel nearby is carrying dangerous cargo',
    ],
    correctAnswer: 'A distress signal - a smoke signal giving off orange-coloured smoke',
    explanation:
      'Annex IV: Orange smoke is the daylight signal on the list. It shows up against sea and sky where a flare in sunshine will not, and it lies on the water long enough for an aircraft to run down on it, which is why it is carried alongside the flares rather than instead of them.',
  },
  {
    id: 'di-04',
    category: 'distress-signals',
    prompt:
      'A rocket climbs from a vessel and bursts into several separate red stars. Fired again a short while later, what is it?',
    options: [
      'A distress signal - rockets or shells throwing red stars, fired one at a time at short intervals',
      'A line-throwing rocket, sent across to pass a towline',
      'A signal that the vessel is about to alter course to starboard',
      'A green star shell, used to acknowledge that a signal has been seen',
    ],
    correctAnswer:
      'A distress signal - rockets or shells throwing red stars, fired one at a time at short intervals',
    explanation:
      'Annex IV: Rockets or shells throwing red stars, fired one at a time at short intervals, are a distress signal in their own right and separate from the parachute flare. Several stars from one burst, repeated, is what tells them apart at a distance from one light hanging under a canopy.',
  },
  {
    id: 'di-05',
    category: 'distress-signals',
    prompt:
      'A vessel hoists two code flags on one halyard: a blue and white chequered flag above a flag of five horizontal stripes, blue, white, red, white, blue. What is she saying?',
    options: [
      'She is in distress and requires assistance - the code signal November over Charlie',
      'She requires a pilot',
      'She is dragging her anchor',
      'She is about to weigh anchor and get under way',
    ],
    correctAnswer:
      'She is in distress and requires assistance - the code signal November over Charlie',
    explanation:
      'Annex IV: The International Code signal of distress is November over Charlie - the chequered flag above the five-striped one. It is on the list precisely because it needs no radio, no pyrotechnics and no power: two flags out of the locker, hoisted where they can be seen.',
  },
  {
    id: 'di-06',
    category: 'distress-signals',
    prompt:
      'A vessel has hoisted a plain square flag with a round black shape immediately above it. What does the pairing mean?',
    options: [
      'Distress - a square flag with a ball, or anything resembling a ball, above or below it',
      'That she is at anchor and has a second anchor down',
      'That she is not under command and cannot manoeuvre',
      'That she has a pilot on board and is under his direction',
    ],
    correctAnswer:
      'Distress - a square flag with a ball, or anything resembling a ball, above or below it',
    explanation:
      'Annex IV: A square flag with a ball above or below it is a distress signal, and "anything resembling a ball" is the wording - a fender, a bucket, a coiled warp. It is on the list as the improvised signal, for a vessel with nothing aboard that was made to be a signal.',
  },
  {
    id: 'di-07',
    category: 'distress-signals',
    prompt:
      'A person on a boat is slowly and repeatedly raising both outstretched arms to each side and lowering them again. What are they doing?',
    options: [
      'Making a distress signal - slowly and repeatedly raising and lowering arms outstretched to each side',
      'Signalling that they have seen you and need no assistance',
      'Signalling that their vessel is about to get under way',
      'Waving a greeting, which carries no meaning under the Rules',
    ],
    correctAnswer:
      'Making a distress signal - slowly and repeatedly raising and lowering arms outstretched to each side',
    explanation:
      'Annex IV: Arms outstretched to each side, raised and lowered slowly and repeatedly, is a listed distress signal. The slowness and the repetition are the whole of it - one wave is a greeting, and reading it as one is a mistake made from a distance every season.',
  },
  {
    id: 'di-08',
    category: 'distress-signals',
    prompt: 'What does a vessel showing flames on board, as from a burning tar barrel, indicate?',
    options: [
      'Distress - flames on the vessel are a listed distress signal',
      'That she is discharging or loading a flammable cargo',
      'That she is engaged in mineclearance and others must keep clear',
      'That she is burning waste and requires a wide berth',
    ],
    correctAnswer: 'Distress - flames on the vessel are a listed distress signal',
    explanation:
      'Annex IV: Flames on the vessel, as from a burning tar barrel or oil barrel, is on the list. It is one of the older entries and it survives for the same reason the square flag and the ball do: it can be made from what is aboard when everything manufactured for the purpose has been used up.',
  },
  {
    id: 'di-09',
    category: 'distress-signals',
    prompt:
      'A gun or other explosive signal is being fired as a distress signal. At what interval must it be fired?',
    options: [
      'At intervals of about a minute',
      'At intervals of about five seconds',
      'At intervals of about ten minutes',
      'Continuously, with no interval',
    ],
    correctAnswer: 'At intervals of about a minute',
    explanation:
      'Annex IV: A gun or other explosive signal fired at intervals of about a minute is a distress signal. The interval is the signal - a single report is a report, and it is the deliberate repetition at about a minute that separates distress from any other bang heard over water.',
  },
  {
    id: 'di-10',
    category: 'distress-signals',
    prompt: 'What does a continuous sounding with any fog-signalling apparatus mean?',
    options: [
      'Distress - it is a listed distress signal',
      'That the vessel is under way in restricted visibility and making way',
      'That the vessel doubts the intentions of another and is signalling so',
      'That the vessel is aground in restricted visibility',
    ],
    correctAnswer: 'Distress - it is a listed distress signal',
    explanation:
      'Annex IV: A continuous sounding with any fog-signalling apparatus is a distress signal. Every other use of a fog signal is a rhythm of separated blasts with a gap between them, so a sound that simply does not stop is unmistakable even to someone who cannot see the vessel making it.',
  },
  {
    id: 'di-11',
    category: 'distress-signals',
    prompt:
      'A signal is being made as three short, three long and three short, by flashing light. What is it, and how may it be sent?',
    options: [
      'The group SOS - a distress signal, and it may be made by any signalling method',
      'The group SOS - a distress signal, but valid only when sent by radiotelegraphy',
      'The letter O repeated, a warning that a vessel is manoeuvring',
      'An acknowledgement that a distress signal has been received',
    ],
    correctAnswer:
      'The group SOS - a distress signal, and it may be made by any signalling method',
    explanation:
      'Annex IV: The signal is the Morse group SOS, and it is listed as a distress signal made by any signalling method - a lamp, a torch, a mirror, a whistle, a hand on a hull. That is what makes it the last signal available to a vessel that has lost everything else.',
  },
  {
    id: 'di-12',
    category: 'distress-signals',
    prompt: 'What is the listed distress signal sent by radiotelephony?',
    options: [
      'The spoken word "Mayday"',
      'The spoken word "Pan-Pan"',
      'The spoken word "Seelonce"',
      'The spoken word "Securite"',
    ],
    correctAnswer: 'The spoken word "Mayday"',
    explanation:
      'Annex IV: The distress signal by radiotelephony is the spoken word Mayday. The other three words are real radio procedure, but they are urgency, radio silence and safety respectively - none of them is the distress signal, and using one of them for distress is a call that will be answered as something less than it is.',
  },
  {
    id: 'di-13',
    category: 'distress-signals',
    prompt:
      'A crew member activates the vessel\'s EPIRB. Is that a distress signal in the same sense as a flare?',
    options: [
      'Yes - signals transmitted by emergency position-indicating radio beacons are on the same list',
      'No - an EPIRB is a locating device and is not itself a distress signal',
      'Yes, but only once it has been confirmed by a spoken distress call',
      'No - an EPIRB signal counts as a distress signal only outside territorial waters',
    ],
    correctAnswer:
      'Yes - signals transmitted by emergency position-indicating radio beacons are on the same list',
    explanation:
      'Annex IV: Signals transmitted by emergency position-indicating radio beacons are listed, as are approved signals transmitted by radiocommunication systems including survival craft radar transponders. The list was extended to them for exactly the reason it holds a burning tar barrel: it takes whatever the vessel actually has.',
  },
  {
    id: 'di-14',
    category: 'distress-signals',
    prompt:
      'You would like to use a red parachute flare to attract the attention of a friend ashore. What does the Convention say?',
    options: [
      'It is prohibited - these signals may not be used for anything except to indicate distress, nor may signals that could be confused with them',
      'It is permitted, so long as no other vessel is in sight at the time',
      'It is permitted, so long as the coastguard is informed beforehand',
      'It is prohibited only for rockets, and hand flares may be used freely',
    ],
    correctAnswer:
      'It is prohibited - these signals may not be used for anything except to indicate distress, nor may signals that could be confused with them',
    explanation:
      'Annex IV: The use or exhibition of any of these signals except to indicate distress and need of assistance is prohibited, and so is the use of any signal that may be confused with them. The reason is the cost of the answer: a lifeboat launched, a helicopter flown and a crew put at risk for a flare fired to say hello.',
  },
  {
    id: 'di-15',
    category: 'distress-signals',
    prompt: 'What do the Rules require of a vessel in distress that requires assistance?',
    options: [
      'That she use or exhibit the signals set out in the annex on distress signals',
      'That she sound the manoeuvring and warning signals until answered',
      'That she exhibit the lights and shapes of a vessel not under command',
      'That she anchor and wait to be found, if she is able to anchor',
    ],
    correctAnswer: 'That she use or exhibit the signals set out in the annex on distress signals',
    explanation:
      'Rule 37 is one sentence: a vessel in distress and requiring assistance shall use or exhibit the signals described in Annex IV. The rule itself lists nothing - it points at the annex, which is why the annex and not the rule is what has to be learned signal by signal.',
  },
  {
    id: 'di-16',
    category: 'distress-signals',
    prompt: 'Which of these is NOT a distress signal?',
    options: [
      'A white flare',
      'A hand flare showing a red light',
      'A smoke signal giving off orange-coloured smoke',
      'The International Code signal November over Charlie',
    ],
    correctAnswer: 'A white flare',
    explanation:
      'Annex IV: Every distress pyrotechnic on the list is red, or orange in the case of smoke. A white flare is not on it - white is used to say "I am here, I have seen you", most often to warn a vessel closing on a collision course that she has not been seen. Firing white where red was meant will be read as no distress at all.',
  },
];

// --- VHF PROCEDURE (17 questions) ---
//
// Not COLREGS. What may be said on a marine VHF set, and on which channel, is
// radio regulation - the FCC in US waters, the ITU internationally - and there
// is no rule number to cite, so these explanations open with the topic label
// "Radio procedure". The distress signals category next door is the opposite
// case and carries a real Annex IV citation; the two must not be confused.
//
// Text questions throughout, and no diagram: a radio call is words in an
// order. What a candidate is examined on is which of the three priority calls
// a situation deserves and what is said in what sequence, and a picture of a
// handset would be scenery around that.
//
// The three calls are spelled here as they are spoken - Mayday, Pan-Pan,
// Securite - and each is said three times at the head of the call. The
// repetition is not emphasis: it is what lets a listener who caught only the
// tail of the first word know what is coming.

const vhfProcedureQuestions: ColregsQuestion[] = [
  {
    id: 'vf-01',
    category: 'vhf-procedure',
    prompt:
      'Which call is made when a vessel or a person is in grave and imminent danger and requires immediate assistance?',
    options: ['Mayday', 'Pan-Pan', 'Securite', 'Seelonce'],
    correctAnswer: 'Mayday',
    explanation:
      'Radio procedure: Mayday is the distress call, and the threshold for it is grave and imminent danger requiring immediate assistance. Nothing outranks it - every other station on the channel stops transmitting for it.',
  },
  {
    id: 'vf-02',
    category: 'vhf-procedure',
    prompt:
      'Which call is made for an urgent message about the safety of a vessel or a person, where nobody is in immediate danger of losing their life?',
    options: ['Pan-Pan', 'Mayday', 'Securite', 'Seelonce'],
    correctAnswer: 'Pan-Pan',
    explanation:
      'Radio procedure: Pan-Pan is the urgency call, one step below distress. It is the call for a situation that is serious and getting worse but has not yet become a matter of life - and it is the call most often skipped by people who think it is not bad enough yet to use the radio at all.',
  },
  {
    id: 'vf-03',
    category: 'vhf-procedure',
    prompt:
      'Which call announces a message about navigational safety or an important meteorological warning?',
    options: ['Securite', 'Pan-Pan', 'Mayday', 'Seelonce'],
    correctAnswer: 'Securite',
    explanation:
      'Radio procedure: Securite, spoken say-cure-ee-tay, is the safety call - the lowest of the three priorities. Coast stations use it to open a gale warning or a navigational warning, and a vessel may use it too, to report a hazard she has just seen.',
  },
  {
    id: 'vf-04',
    category: 'vhf-procedure',
    prompt: 'On which VHF channel are all three of those calls made?',
    options: ['Channel 16', 'Channel 13', 'Channel 22A', 'Channel 9'],
    correctAnswer: 'Channel 16',
    explanation:
      'Radio procedure: Channel 16 is the international distress, safety and calling channel, and the three priority calls are made there. In US waters the announcement is often made on 16 and the message itself passed on 22A once the Coast Guard answers, which is why 16 has to be kept clear.',
  },
  {
    id: 'vf-05',
    category: 'vhf-procedure',
    prompt: 'How many times is the word "Mayday" spoken at the start of a distress call?',
    options: ['Three times', 'Once', 'Twice', 'Continuously until answered'],
    correctAnswer: 'Three times',
    explanation:
      'Radio procedure: Three times - "Mayday, Mayday, Mayday". Pan-Pan and Securite are given three times too. A listener who caught only the end of the first word still hears the next two, and knows in about two seconds what kind of call this is.',
  },
  {
    id: 'vf-06',
    category: 'vhf-procedure',
    prompt: 'What immediately follows "Mayday, Mayday, Mayday" in a distress call?',
    options: [
      '"This is" followed by the vessel\'s name, spoken three times',
      'Your position, given as latitude and longitude',
      'The nature of the distress',
      'The number of persons on board',
    ],
    correctAnswer: '"This is" followed by the vessel\'s name, spoken three times',
    explanation:
      'Radio procedure: "This is" and then the vessel\'s name three times, so that a station straining to hear gets three chances at who is calling. The call sign follows the name where the vessel has one. Everything else in the call comes after you have been identified.',
  },
  {
    id: 'vf-07',
    category: 'vhf-procedure',
    prompt:
      'Having said "Mayday" once more and given your vessel\'s name, what is the next thing you pass?',
    options: [
      'Your position',
      'The number of persons on board',
      'The nature of the distress',
      'The kind of assistance you want',
    ],
    correctAnswer: 'Your position',
    explanation:
      'Radio procedure: Position comes first of the details, because it is the one piece of the call that everything else depends on - a rescue that knows what is wrong but not where you are cannot start. Give it as latitude and longitude, or as a bearing and distance from a charted mark.',
  },
  {
    id: 'vf-08',
    category: 'vhf-procedure',
    prompt: 'After the position, what else does a distress call have to carry?',
    options: [
      'The nature of the distress, the assistance you want, and the number of persons on board',
      'The nature of the distress and your intended destination',
      'The number of persons on board and the vessel\'s registration number',
      'The name of your insurer and the vessel\'s home port',
    ],
    correctAnswer:
      'The nature of the distress, the assistance you want, and the number of persons on board',
    explanation:
      'Radio procedure: Nature of the distress, assistance required, and persons on board - then anything else that would help, such as what the vessel looks like and whether she is being abandoned. The head count is what the search is still working from hours later, so it is never left out.',
  },
  {
    id: 'vf-09',
    category: 'vhf-procedure',
    prompt:
      'There is a fire in your engine compartment. It is spreading, you cannot control it, and you are preparing to abandon. Which call do you make?',
    options: ['Mayday', 'Pan-Pan', 'Securite', 'A routine call to the marina on a working channel'],
    correctAnswer: 'Mayday',
    explanation:
      'Radio procedure: A fire out of control on board, with the crew about to take to the water, is grave and imminent danger - Mayday, without hesitating over whether it is bad enough. A call made early can be downgraded later; one made late cannot be made earlier.',
  },
  {
    id: 'vf-10',
    category: 'vhf-procedure',
    prompt:
      'Your engine has failed and you are drifting slowly toward a rocky shore about a mile downwind. Nobody is hurt and the boat is sound. Which call do you make?',
    options: ['Pan-Pan', 'Mayday', 'Securite', 'No call - wait until you are closer to the rocks'],
    correctAnswer: 'Pan-Pan',
    explanation:
      'Radio procedure: This is the textbook urgency call - the vessel is in trouble and the trouble is getting worse, but nobody is yet in danger of their life. Pan-Pan now brings a tow before the situation turns into the Mayday it would otherwise become.',
  },
  {
    id: 'vf-11',
    category: 'vhf-procedure',
    prompt:
      'You pass a half-submerged shipping container drifting in a busy fairway. Which call do you make?',
    options: ['Securite', 'Pan-Pan', 'Mayday', 'None - report it by telephone once ashore'],
    correctAnswer: 'Securite',
    explanation:
      'Radio procedure: A hazard to navigation that threatens nobody at this moment is a safety message - Securite, then the position and description of what you saw. The next boat down the channel may be smaller, faster, or looking the other way.',
  },
  {
    id: 'vf-12',
    category: 'vhf-procedure',
    prompt:
      'A coast station is about to broadcast a gale warning. Which word will open the announcement?',
    options: ['Securite', 'Mayday', 'Pan-Pan', 'Seelonce'],
    correctAnswer: 'Securite',
    explanation:
      'Radio procedure: Meteorological warnings and navigational warnings are safety traffic, so a coast station opens with Securite on 16 and then names the channel the broadcast itself will be made on.',
  },
  {
    id: 'vf-13',
    category: 'vhf-procedure',
    prompt:
      'You hear a Mayday from a vessel some distance away. You are not in a position to help. What do you do?',
    options: [
      'Keep silent on the channel, listen, and write down what you hear',
      'Answer at once to say that you cannot help',
      'Switch off the radio so you do not add to the traffic',
      'Change to a working channel and carry on with your own business',
    ],
    correctAnswer: 'Keep silent on the channel, listen, and write down what you hear',
    explanation:
      'Radio procedure: Silence and a written note. If nobody nearer answers, what you wrote down may be all anyone has. The station in distress, or a station handling the traffic, can impose silence on the channel with "Seelonce Mayday", and that binds every set within range.',
  },
  {
    id: 'vf-14',
    category: 'vhf-procedure',
    prompt:
      'You can see a boat in serious trouble, and you have heard her try to call for help on a radio that is clearly not transmitting. What do you send?',
    options: [
      'A Mayday Relay, giving her position and what you can see',
      'A Mayday, as though the distress were your own',
      'A Pan-Pan, because your own vessel is not in danger',
      'Nothing on the radio - close her and take the crew off first',
    ],
    correctAnswer: 'A Mayday Relay, giving her position and what you can see',
    explanation:
      'Radio procedure: "Mayday Relay" is the call for a distress that is not your own - a vessel whose radio has failed, or one you have heard whose call nobody answered. You give her position and situation, and identify your own vessel as the station relaying, so nobody comes looking for the wrong boat.',
  },
  {
    id: 'vf-15',
    category: 'vhf-procedure',
    prompt: 'You want to arrange a berth with a marina on VHF. How is the channel used?',
    options: [
      'Call briefly on 16, agree a working channel, and pass the whole message there',
      'Pass the whole message on 16, since that is the calling channel',
      'Call on 16 and wait there until the marina is ready to deal with you',
      'Use 16 only if the marina does not answer on a working channel',
    ],
    correctAnswer: 'Call briefly on 16, agree a working channel, and pass the whole message there',
    explanation:
      'Radio procedure: 16 is for calling and for the three priority calls, not for conversation. Establish contact, agree a working channel, and go there - the boat whose Mayday comes thirty seconds later needs the channel you would otherwise be filling with a berthing chat.',
  },
  {
    id: 'vf-16',
    category: 'vhf-procedure',
    prompt: 'What is the difference between "Over" and "Out"?',
    options: [
      'Over invites a reply; Out ends the exchange, and the two are never said together',
      'Over ends the exchange; Out invites a reply',
      'They mean the same thing, and "Over and out" is the correct full form',
      'Over is used on 16 and Out is used on working channels',
    ],
    correctAnswer: 'Over invites a reply; Out ends the exchange, and the two are never said together',
    explanation:
      'Radio procedure: Over hands the channel to the other station and expects an answer. Out says the exchange is finished and no answer is expected. "Over and out" is the two contradicting each other in one breath, which is why it exists in films and not on the water.',
  },
  {
    id: 'vf-17',
    category: 'vhf-procedure',
    prompt: 'You have sent a DSC distress alert from your radio. What do you do next?',
    options: [
      'Follow it immediately with a spoken Mayday call on Channel 16',
      'Wait silently for an acknowledgement before transmitting anything',
      'Send the alert again every minute until someone answers',
      'Switch to a working channel and call for help there',
    ],
    correctAnswer: 'Follow it immediately with a spoken Mayday call on Channel 16',
    explanation:
      'Radio procedure: The digital alert carries your identity and, if the set knows it, your position - it does not carry what is wrong or how many people are aboard. The spoken Mayday on 16 is what makes it a call anyone can act on. An alert sent by accident is cancelled, out loud on 16, and never simply switched off and ignored.',
  },
];

// --- PFD TYPES (16 questions) ---
//
// Seamanship, not COLREGS: what a boat has to carry and how a device is
// approved is Coast Guard equipment regulation, so these explanations open
// with the topic label "Life-saving equipment".
//
// TWO LABELLING SCHEMES, BOTH CURRENT. The Type I to Type V codes are being
// retired in favour of performance levels - 50, 70, 100, 150 - and the change
// has been rolling out through the labels since January 2025. Neither scheme
// is "the answer": a device bought last decade is marked with a type, one
// bought new may be marked with a level, and both are aboard boats right now
// and both are legal. So the bank teaches the types, teaches the levels, and
// teaches the mapping between them, and no question is written as though one
// scheme had replaced the other outright. That is the single most likely thing
// for a later edit to get wrong here.
//
// The buoyancy figures quoted are for adult sizes. Child and infant devices
// carry lower figures on the same type or level, which is why the questions
// that quote a number say whose it is.

const pfdTypesQuestions: ColregsQuestion[] = [
  {
    id: 'pf-01',
    category: 'pfd-types',
    prompt:
      'This device has a deep collar that sits behind the wearer\'s head and two heavy chest panels. Under the older labelling, what is it?',
    options: [
      'A Type I offshore life jacket',
      'A Type III flotation aid',
      'A Type IV throwable device',
      'A Type V special-use device',
    ],
    correctAnswer: 'A Type I offshore life jacket',
    explanation:
      'Life-saving equipment: The deep collar is the offshore jacket. It carries the most buoyancy of the wearable types, 22 pounds for an adult, and it is built to turn most unconscious wearers face-up - the collar is the part doing that work. It is the device for open water where rescue may be hours away.',
  },
  {
    id: 'pf-02',
    category: 'pfd-types',
    prompt:
      'This device is a zip-fronted vest with armholes, no collar, and it stops at the waist. Under the older labelling, what is it?',
    options: [
      'A Type III flotation aid',
      'A Type I offshore life jacket',
      'A Type II near-shore vest',
      'A Type IV throwable device',
    ],
    correctAnswer: 'A Type III flotation aid',
    explanation:
      'Life-saving equipment: A flotation aid is cut for movement and comfort, which is why it gets worn - and a jacket in the locker floats nobody. It carries 15.5 pounds of buoyancy for an adult and will NOT reliably turn an unconscious wearer face-up, so it belongs where help is close and the water is calm.',
  },
  {
    id: 'pf-03',
    category: 'pfd-types',
    prompt:
      'This device is a ring with grab lines seized round the outside of it. Under the older labelling, what is it?',
    options: [
      'A Type IV throwable device',
      'A Type II near-shore vest',
      'A Type V special-use device',
      'A Type I offshore life jacket',
    ],
    correctAnswer: 'A Type IV throwable device',
    explanation:
      'Life-saving equipment: A ring buoy is a throwable, not a wearable. The grab lines are the giveaway - they are there for someone already in the water to take hold of. It is thrown to a person overboard and never counts as one of the wearable devices the boat has to carry.',
  },
  {
    id: 'pf-04',
    category: 'pfd-types',
    prompt:
      'This device is a square foam cushion with a grab strap on each side. Under the older labelling, what is it?',
    options: [
      'A Type IV throwable device',
      'A Type III flotation aid',
      'A Type V special-use device',
      'A Type II near-shore vest',
    ],
    correctAnswer: 'A Type IV throwable device',
    explanation:
      'Life-saving equipment: The buoyant cushion is a throwable, the same class as the ring buoy. The straps are for hands, not shoulders. Sitting on one is what most of them do for a living, but the moment it is needed it goes over the side, not on.',
  },
  {
    id: 'pf-05',
    category: 'pfd-types',
    prompt:
      'This device is worn flat and deflated, with suspender straps, a small gas cylinder and a pull tab. Under the older labelling, what is it?',
    options: [
      'A Type V special-use device',
      'A Type I offshore life jacket',
      'A Type IV throwable device',
      'A Type III flotation aid',
    ],
    correctAnswer: 'A Type V special-use device',
    explanation:
      'Life-saving equipment: An inflatable is a special-use device. It is comfortable enough to be worn all day, which is its whole argument, and once inflated many of them give more buoyancy than a foam jacket. The catch is on its own label: a special-use device only counts toward the boat\'s requirement when it is worn as that label says.',
  },
  {
    id: 'pf-06',
    category: 'pfd-types',
    prompt: 'Which of the wearable types is designed to turn most unconscious wearers face-up?',
    options: [
      'Type I',
      'Type III',
      'Type IV',
      'None of them will turn an unconscious wearer',
    ],
    correctAnswer: 'Type I',
    explanation:
      'Life-saving equipment: Turning an unconscious wearer face-up is what separates the offshore jacket from the rest. A Type II will turn some wearers, though not as reliably; a Type III is not designed to and generally will not. It is the difference between a device that keeps you alive while you are conscious and one that keeps you alive when you are not.',
  },
  {
    id: 'pf-07',
    category: 'pfd-types',
    prompt: 'What is the minimum buoyancy of an adult Type I offshore life jacket?',
    options: ['22 pounds', '15.5 pounds', '7 pounds', '35 pounds'],
    correctAnswer: '22 pounds',
    explanation:
      'Life-saving equipment: 22 pounds for an adult offshore jacket, against 15.5 for a near-shore vest or a flotation aid. The extra buoyancy is what floats a person high enough for the collar to do its work, and it is most of the reason the offshore jacket is as bulky as it is.',
  },
  {
    id: 'pf-08',
    category: 'pfd-types',
    prompt:
      'Which wearable type is intended for calm inland water where a quick rescue is likely, and carries 15.5 pounds of buoyancy for an adult?',
    options: [
      'Type II - the near-shore vest',
      'Type I - the offshore life jacket',
      'Type IV - the throwable device',
      'Type V - the special-use device',
    ],
    correctAnswer: 'Type II - the near-shore vest',
    explanation:
      'Life-saving equipment: The near-shore vest is the yoke-shaped jacket found in most rental lockers. It has the same 15.5 pounds as a flotation aid but is cut as a yoke rather than as a vest, and it will turn some unconscious wearers face-up where a flotation aid will not.',
  },
  {
    id: 'pf-09',
    category: 'pfd-types',
    prompt: 'Why can a Type IV device never be counted as one of the wearable PFDs a boat carries?',
    options: [
      'It is designed to be thrown to a person in the water, not worn, so it does nothing for someone who is knocked overboard unconscious',
      'It has too little buoyancy to hold up an adult',
      'It is approved only for vessels under 16 feet',
      'It is approved only for use on inland waters',
    ],
    correctAnswer:
      'It is designed to be thrown to a person in the water, not worn, so it does nothing for someone who is knocked overboard unconscious',
    explanation:
      'Life-saving equipment: A throwable has to be thrown by somebody who saw you go. Boats 16 feet and over carry at least one throwable IN ADDITION to a wearable device for every person aboard - it is an extra, not a substitute, and the two requirements are counted separately.',
  },
  {
    id: 'pf-10',
    category: 'pfd-types',
    prompt: 'Under what condition does a Type V special-use device satisfy the carriage requirement?',
    options: [
      'Only when it is worn, and worn in the way its own label specifies',
      'Only when it is stowed where it can be reached within 30 seconds',
      'Only on vessels under 26 feet',
      'It always satisfies it, the same as any other type',
    ],
    correctAnswer: 'Only when it is worn, and worn in the way its own label specifies',
    explanation:
      'Life-saving equipment: A special-use device counts only while it is being worn as labelled - that condition is printed on the device itself, and the label is part of the approval. An inflatable in a cockpit locker is not a life jacket for legal purposes and is not one in practice either.',
  },
  {
    id: 'pf-11',
    category: 'pfd-types',
    prompt:
      'You are crossing offshore in cold water, hours from the nearest help, and you may end up in the water for a long time. Which device do you want?',
    options: [
      'An offshore life jacket - Type I, or Level 150 under the new labelling',
      'A flotation aid - Type III, or Level 70',
      'A throwable cushion, kept within reach',
      'Any device, provided one is aboard for each person',
    ],
    correctAnswer: 'An offshore life jacket - Type I, or Level 150 under the new labelling',
    explanation:
      'Life-saving equipment: Offshore, cold, and a long wait is exactly the case the offshore jacket was designed for: the most buoyancy, the best chance of turning you face-up, and enough freeboard to keep your mouth clear in a sea. Comfort matters less on a passage where you are not wearing it to move around in.',
  },
  {
    id: 'pf-12',
    category: 'pfd-types',
    prompt:
      'You are paddling and dinghy sailing on a lake, close to shore and in company, and you need to move freely. Which device fits the use?',
    options: [
      'A flotation aid - Type III, or Level 70',
      'An offshore life jacket - Type I, or Level 150',
      'A throwable ring buoy',
      'No device is required in sheltered water',
    ],
    correctAnswer: 'A flotation aid - Type III, or Level 70',
    explanation:
      'Life-saving equipment: A flotation aid is the right answer here for a reason that is not written in the buoyancy table: it is the one that will actually be worn while you are hiking out or paddling. Rescue is minutes away and the water is flat, which is the case the flotation aid is rated for.',
  },
  {
    id: 'pf-13',
    category: 'pfd-types',
    prompt:
      'The Coast Guard is retiring the Type I to Type V codes. What is replacing them on new labels?',
    options: [
      'Performance levels - 50, 70, 100 and 150 - with the higher number meaning more performance in rougher water',
      'A pass or fail approval mark with no grading between devices',
      'A colour code, with orange for offshore and yellow for inland',
      'The buoyancy in pounds, printed on its own with no other classification',
    ],
    correctAnswer:
      'Performance levels - 50, 70, 100 and 150 - with the higher number meaning more performance in rougher water',
    explanation:
      'Life-saving equipment: The new labels carry a performance level and a set of icons showing where the device should and should not be used. The numbers run 50, 70, 100 and 150, and they climb with buoyancy and with the ability to right and support a wearer. The scheme lines the United States up with the international one.',
  },
  {
    id: 'pf-14',
    category: 'pfd-types',
    prompt:
      'A new life jacket is labelled Level 150. Which of the older type codes is it closest to?',
    options: ['Type I', 'Type III', 'Type IV', 'Type V'],
    correctAnswer: 'Type I',
    explanation:
      'Life-saving equipment: Level 150 is the offshore end of the scale, where the Type I jacket sat - most buoyancy, best chance of turning an unconscious wearer. Level 70 sits roughly where the flotation aid was, and Level 50 covers the special-use devices for sheltered water and strong swimmers. The mapping is approximate, because the tests behind the two schemes are not identical.',
  },
  {
    id: 'pf-15',
    category: 'pfd-types',
    prompt:
      'Your life jackets are labelled with the old type codes. Are they still acceptable now that performance levels are appearing?',
    options: [
      'Yes - an approved device labelled with a type remains acceptable; the change is to how new devices are labelled',
      'No - every device must be relabelled or replaced before the boat may be used',
      'Only for vessels under 26 feet',
      'Only on inland waters, not offshore',
    ],
    correctAnswer:
      'Yes - an approved device labelled with a type remains acceptable; the change is to how new devices are labelled',
    explanation:
      'Life-saving equipment: The transition is a labelling change, not a recall. Type-marked devices in good condition remain approved and remain legal, which is why both schemes are aboard boats at the same time and why a candidate has to be able to read either. What has always mattered more than the label is condition: a jacket with rotted webbing or a fired cylinder is no jacket at all.',
  },
  {
    id: 'pf-16',
    category: 'pfd-types',
    prompt: 'What do the icons on a new performance-level label tell you?',
    options: [
      'Where the device is suitable to use, and what it should not be relied on for',
      'The date the device was manufactured and the date it expires',
      'The name of the laboratory that tested the device',
      'The size of vessel the device may be carried aboard',
    ],
    correctAnswer: 'Where the device is suitable to use, and what it should not be relied on for',
    explanation:
      'Life-saving equipment: The icon panel is the plain-language half of the new label - the water the device is meant for, whether it must be worn to count, whether it needs to be inflated, and warnings such as its not being intended to turn an unconscious wearer. It exists because "Type III" told a first-time buyer nothing at all.',
  },
];

// --- FIRE SAFETY (12 questions) ---
//
// Seamanship, not COLREGS: what burns and what puts it out is not a rule of
// the road, so these explanations open with the topic label "Fire safety".
//
// The classes are the American ones - A, B, C, D and K. Other countries letter
// them differently, and a question that quoted a class without saying whose
// would be wrong somewhere, so the wording stays with the class letters a US
// extinguisher is actually stamped with.
//
// No diagram. A fire class is a category of fuel, not a thing with a shape,
// and the extinguisher label that carries the letter is a label - drawing one
// would be drawing the answer in type.

const fireSafetyQuestions: ColregsQuestion[] = [
  {
    id: 'fs-01',
    category: 'fire-safety',
    prompt: 'What burns in a Class A fire?',
    options: [
      'Ordinary combustibles - wood, cloth, paper, canvas',
      'Flammable liquids - fuel, oil, grease',
      'Energised electrical equipment',
      'Cooking oils and fats',
    ],
    correctAnswer: 'Ordinary combustibles - wood, cloth, paper, canvas',
    explanation:
      'Fire safety: Class A is ordinary combustible material - the bunk cushions, the charts, the woodwork. It is the one class that water is the right answer for, because water works by cooling and there is nothing here for it to spread or conduct.',
  },
  {
    id: 'fs-02',
    category: 'fire-safety',
    prompt: 'What burns in a Class B fire?',
    options: [
      'Flammable liquids - petrol, diesel, oil, grease',
      'Ordinary combustibles such as wood and cloth',
      'Energised electrical equipment',
      'Combustible metals',
    ],
    correctAnswer: 'Flammable liquids - petrol, diesel, oil, grease',
    explanation:
      'Fire safety: Class B is flammable liquids, which on a boat means the fuel, the oil and everything in the engine space. It is the class most marine extinguishers are bought for, and the class water must never be used on.',
  },
  {
    id: 'fs-03',
    category: 'fire-safety',
    prompt: 'What burns in a Class C fire?',
    options: [
      'Energised electrical equipment - wiring, panels, motors',
      'Cooking oils and fats',
      'Combustible metals such as magnesium',
      'Ordinary combustibles such as wood and cloth',
    ],
    correctAnswer: 'Energised electrical equipment - wiring, panels, motors',
    explanation:
      'Fire safety: Class C is a fire in equipment that is still live. The class is really about the electricity rather than the fuel: kill the power and what is left burning is a Class A or a Class B fire, and can be fought as one.',
  },
  {
    id: 'fs-04',
    category: 'fire-safety',
    prompt: 'What burns in a Class D fire?',
    options: [
      'Combustible metals - magnesium, titanium, sodium',
      'Cooking oils and fats',
      'Flammable liquids',
      'Energised electrical equipment',
    ],
    correctAnswer: 'Combustible metals - magnesium, titanium, sodium',
    explanation:
      'Fire safety: Class D is burning metal, and it needs a dry powder agent made for the metal in question. Water is dangerous on it - a burning metal can strip water apart and take the oxygen out of it, feeding the fire with what was meant to smother it.',
  },
  {
    id: 'fs-05',
    category: 'fire-safety',
    prompt: 'What burns in a Class K fire, and what puts it out?',
    options: [
      'Cooking oils and fats - put out with a wet chemical agent',
      'Cooking oils and fats - put out with water',
      'Galley gas from a leaking cylinder - put out by smothering with a blanket',
      'Alcohol stove fuel - put out with dry powder only',
    ],
    correctAnswer: 'Cooking oils and fats - put out with a wet chemical agent',
    explanation:
      'Fire safety: Class K is the galley class - cooking oil and fat, burning far hotter than the flash point of the oil around it. A wet chemical agent turns the surface to a soapy crust and seals it. Water thrown into hot oil flashes to steam under the surface and throws burning oil across the galley.',
  },
  {
    id: 'fs-06',
    category: 'fire-safety',
    prompt: 'Why must water never be used on a burning fuel spill?',
    options: [
      'The fuel floats on the water and the fire is carried wherever the water runs',
      'The water reacts chemically with the fuel and explodes',
      'The water cools the fuel below its flash point and it reignites later',
      'It is permitted, provided the water is applied as a fine spray',
    ],
    correctAnswer:
      'The fuel floats on the water and the fire is carried wherever the water runs',
    explanation:
      'Fire safety: Water sinks, the fuel floats, and the burning layer goes with it - down into the bilge, aft under the sole, wherever the water drains. A liquid fire is put out by smothering it: foam, dry chemical or carbon dioxide, cutting the flame off from the air.',
  },
  {
    id: 'fs-07',
    category: 'fire-safety',
    prompt: 'What three things must be present together for a fire to burn?',
    options: [
      'Fuel, heat and oxygen',
      'Fuel, fumes and confinement',
      'Heat, pressure and oxygen',
      'Fuel, oxygen and an electrical source',
    ],
    correctAnswer: 'Fuel, heat and oxygen',
    explanation:
      'Fire safety: Fuel, heat and oxygen - the fire triangle. Every method of fighting a fire is the removal of one of the three: shutting off the fuel supply, cooling with water, or smothering to keep the air out. Knowing which one an extinguisher does is what tells you whether it suits the fire in front of you.',
  },
  {
    id: 'fs-08',
    category: 'fire-safety',
    prompt: 'What do the four steps of PASS stand for when using a portable extinguisher?',
    options: [
      'Pull the pin, Aim at the base, Squeeze the handle, Sweep side to side',
      'Point the nozzle, Advance, Spray, Stand clear',
      'Prepare, Approach, Sound the alarm, Spray',
      'Pull the pin, Approach upwind, Squeeze, Stop',
    ],
    correctAnswer: 'Pull the pin, Aim at the base, Squeeze the handle, Sweep side to side',
    explanation:
      'Fire safety: Pull, Aim, Squeeze, Sweep. The step people get wrong is the aim: a portable extinguisher holds only seconds of agent, and every second spent on the flames rather than on what is burning underneath them is wasted.',
  },
  {
    id: 'fs-09',
    category: 'fire-safety',
    prompt: 'Where do you aim the extinguisher?',
    options: [
      'At the base of the flames, where the fuel is',
      'At the top of the flames, where the fire is hottest',
      'At the smoke above the fire',
      'At the bulkhead behind the fire, to cool it',
    ],
    correctAnswer: 'At the base of the flames, where the fuel is',
    explanation:
      'Fire safety: The flame is the fuel already burning; the fire is the fuel about to. Aiming at the base is what cuts the two apart. Sweeping across it, rather than holding on one spot, is what covers the whole of the burning surface before the extinguisher empties.',
  },
  {
    id: 'fs-10',
    category: 'fire-safety',
    prompt:
      'You have a fire in the engine compartment and the boat is under way. What do you do before fighting it?',
    options: [
      'Stop, shut off the fuel and the blowers, and turn the boat so the fire is downwind of the crew',
      'Increase speed to blow the smoke clear of the cockpit',
      'Turn the boat so the wind carries the flames forward over the deck',
      'Open the hatch fully at once to see what is burning',
    ],
    correctAnswer:
      'Stop, shut off the fuel and the blowers, and turn the boat so the fire is downwind of the crew',
    explanation:
      'Fire safety: Stopping ends the airflow that a moving boat forces into the compartment; shutting off fuel and blowers takes away the supply and the draught. Turning so the fire is downwind keeps the flame and the smoke off the people who have to fight it and off the way out.',
  },
  {
    id: 'fs-11',
    category: 'fire-safety',
    prompt:
      'Why should you not throw open the engine hatch to fight a fire in the compartment?',
    options: [
      'Opening it feeds the fire a rush of air - use the fire port, or open only enough to discharge into the space',
      'Opening it will let the extinguishing agent escape before it can work',
      'The hatch will warp and cannot be closed again',
      'It is only a problem on a diesel engine, not a petrol one',
    ],
    correctAnswer:
      'Opening it feeds the fire a rush of air - use the fire port, or open only enough to discharge into the space',
    explanation:
      'Fire safety: A fire in a closed space is already short of oxygen. Flinging the hatch back hands it a lungful and can put the flame straight into your face. That is what the small fire port in the hatch is for - the extinguisher goes through it and the space stays shut.',
  },
  {
    id: 'fs-12',
    category: 'fire-safety',
    prompt: 'What does the letter in an extinguisher rating such as B-I tell you?',
    options: [
      'The class of fire the extinguisher is rated to fight',
      'The year the extinguisher was manufactured',
      'The pressure the extinguisher is charged to',
      'The size of vessel it may be carried aboard',
    ],
    correctAnswer: 'The class of fire the extinguisher is rated to fight',
    explanation:
      'Fire safety: The letter is the class - a B rating is for flammable liquids - and the numeral that follows it is the size, with a larger numeral meaning more agent. Recent extinguishers carry numeric ratings such as 5-B and 20-B instead, but the letter means the same thing on both.',
  },
];

// --- DECK SEAMANSHIP (27 questions) ---
//
// Seamanship, not COLREGS. One category holding three topics that are all the
// same kind of knowledge - the working vocabulary of the deck:
//
//   dk-01 to dk-13   the parts of the boat            "Hull and deck"
//   dk-14 to dk-22   rope and rigging terminology     "Rigging"
//   dk-23 to dk-27   what an order to the helm means  "Helm orders"
//
// They are one card rather than three because each alone is too thin to be a
// card and because the thing being drilled is identical in all three: someone
// says a word, and you have to know what it points at. The topic labels keep
// them apart on the answer screen, which is where the distinction is worth
// something - the badge under a rope question says Rigging, not the name of
// the whole card.
//
// The rope questions are terminology, not knot-tying. Which knot to use, and
// how to tie it, cannot be examined honestly in multiple choice and cannot be
// learned from a diagram either.

const deckSeamanshipQuestions: ColregsQuestion[] = [
  {
    id: 'dk-01',
    category: 'deck-seamanship',
    prompt: 'What is the forward part of a boat called?',
    options: ['The bow', 'The stern', 'The beam', 'The transom'],
    correctAnswer: 'The bow',
    explanation:
      'Hull and deck: The bow is the forward part. Its leading edge, the upright timber or moulding that cuts the water, is the stem. Forward of the boat is ahead; something off the bow but not dead ahead is on the bow, port or starboard.',
  },
  {
    id: 'dk-02',
    category: 'deck-seamanship',
    prompt: 'What is the after part of a boat called?',
    options: ['The stern', 'The bow', 'The keel', 'The quarter'],
    correctAnswer: 'The stern',
    explanation:
      'Hull and deck: The stern is the after part of the boat. The quarter is a narrower word for the same end - it is the part of the side between the beam and the stern, so a vessel astern of you and a little to port is on your port quarter.',
  },
  {
    id: 'dk-03',
    category: 'deck-seamanship',
    prompt: 'What is the flat surface closing the after end of the hull called?',
    options: ['The transom', 'The stern', 'The thwart', 'The gunwale'],
    correctAnswer: 'The transom',
    explanation:
      'Hull and deck: The transom is the flat plate or board across the after end. It is not a synonym for the stern - the stern is the whole after part of the boat, and the transom is the one surface closing it, which is where an outboard hangs and where the boat\'s name goes.',
  },
  {
    id: 'dk-04',
    category: 'deck-seamanship',
    prompt: 'What is the backbone running fore and aft along the bottom of the hull called?',
    options: ['The keel', 'The chine', 'The rudder', 'The gunwale'],
    correctAnswer: 'The keel',
    explanation:
      'Hull and deck: The keel is the boat\'s backbone, running the length of her along the bottom centreline. Everything else is built off it, and on a sailing boat the part that hangs below the hull to resist leeway is named for it too.',
  },
  {
    id: 'dk-05',
    category: 'deck-seamanship',
    prompt: 'What is the upper edge of a boat\'s side called?',
    options: ['The gunwale', 'The thwart', 'The transom', 'The waterline'],
    correctAnswer: 'The gunwale',
    explanation:
      'Hull and deck: The gunwale - said "gunnel" - is the upper edge of the side, running from bow to stern. It is the edge you grip stepping aboard and the edge a boat is swamped over, which is why the distance from it down to the water has a name of its own.',
  },
  {
    id: 'dk-06',
    category: 'deck-seamanship',
    prompt:
      'What is the distance from the waterline up to the lowest point of the gunwale called?',
    options: ['Freeboard', 'Draft', 'Beam', 'Trim'],
    correctAnswer: 'Freeboard',
    explanation:
      'Hull and deck: Freeboard is how much boat there is between the sea and the deck edge - the margin before water comes aboard. Loading a boat down reduces it, which is why an overloaded boat is dangerous in a chop long before it is anywhere near sinking.',
  },
  {
    id: 'dk-07',
    category: 'deck-seamanship',
    prompt: 'What is the distance from the waterline down to the lowest point of the hull called?',
    options: ['Draft', 'Freeboard', 'Beam', 'Bilge'],
    correctAnswer: 'Draft',
    explanation:
      'Hull and deck: Draft is how deep she sits - the depth of water she needs to float. It is the figure read against the charted depth, and the one that decides whether a sounding on the chart is water you can cross or ground you will hit.',
  },
  {
    id: 'dk-08',
    category: 'deck-seamanship',
    prompt: 'What is the blade hung aft, below the waterline, that steers the boat called?',
    options: ['The rudder', 'The keel', 'The tiller', 'The transom'],
    correctAnswer: 'The rudder',
    explanation:
      'Hull and deck: The rudder is the blade in the water. The tiller or the wheel is what the helmsman holds; the rudder is what it moves. A boat with no way on has no water flowing past the rudder, which is why steering does nothing until she is moving.',
  },
  {
    id: 'dk-09',
    category: 'deck-seamanship',
    prompt: 'What is the line where the hull meets the surface of the water called?',
    options: ['The waterline', 'The chine', 'The gunwale', 'The keel line'],
    correctAnswer: 'The waterline',
    explanation:
      'Hull and deck: The waterline is where the surface cuts the hull. It divides freeboard above from draft below, and its length - the waterline length rather than the overall length - is what largely sets how fast a displacement hull can go.',
  },
  {
    id: 'dk-10',
    category: 'deck-seamanship',
    prompt: 'What is the width of a boat at her widest point called?',
    options: ['The beam', 'The freeboard', 'The draft', 'The bilge'],
    correctAnswer: 'The beam',
    explanation:
      'Hull and deck: Beam is the width at the widest point. The word does double duty for direction as well: something abeam is off the side at a right angle to the boat, which is where the widest part of her is.',
  },
  {
    id: 'dk-11',
    category: 'deck-seamanship',
    prompt: 'What is a seat fitted athwartships in an open boat called?',
    options: ['A thwart', 'A gunwale', 'A bulkhead', 'A sole'],
    correctAnswer: 'A thwart',
    explanation:
      'Hull and deck: A thwart is a seat set across the boat - the word is the old one for "across", the same one in athwartships. It is structural as well as somewhere to sit: it braces the two sides apart.',
  },
  {
    id: 'dk-12',
    category: 'deck-seamanship',
    prompt: 'What is the middle part of a boat, along her length, called?',
    options: ['Amidships', 'Abeam', 'Abaft', 'Aloft'],
    correctAnswer: 'Amidships',
    explanation:
      'Hull and deck: Amidships is the middle of the boat between bow and stern. The word turns up again at the helm, where "midships" means to bring the rudder back to the centreline rather than to go anywhere near the middle of the boat.',
  },
  {
    id: 'dk-13',
    category: 'deck-seamanship',
    prompt: 'Looking forward from the stern, which side of the boat is the port side?',
    options: [
      'The left-hand side',
      'The right-hand side',
      'Whichever side the helm is on',
      'Whichever side is to windward',
    ],
    correctAnswer: 'The left-hand side',
    explanation:
      'Hull and deck: Port is the left side looking forward, starboard the right. They are used instead of left and right precisely because they do not depend on which way the person speaking happens to be facing - the port side is the port side whether you are looking forward or aft.',
  },
  {
    id: 'dk-14',
    category: 'deck-seamanship',
    prompt: 'What is a bend?',
    options: [
      'A knot that joins two ropes together',
      'A knot that makes a rope fast to an object',
      'A curve put in a rope where the ends do not cross',
      'The direction in which the strands of a rope are twisted',
    ],
    correctAnswer: 'A knot that joins two ropes together',
    explanation:
      'Rigging: A bend joins rope to rope - the sheet bend and the carrick bend are named for what they do. It is worth keeping the three words apart: a bend joins two ropes, a hitch makes fast to something else, and a knot is either the general word or one tied in the rope itself.',
  },
  {
    id: 'dk-15',
    category: 'deck-seamanship',
    prompt: 'What is a hitch?',
    options: [
      'A knot that makes a rope fast to an object such as a ring, a rail or a spar',
      'A knot that joins two ropes of different sizes',
      'The free end of a rope, the end not in use',
      'A heavy rope used for towing or mooring',
    ],
    correctAnswer: 'A knot that makes a rope fast to an object such as a ring, a rail or a spar',
    explanation:
      'Rigging: A hitch attaches a rope to something that is not another rope - a clove hitch round a piling, a rolling hitch on a spar. Most hitches depend on the object they are tied round; take that away and they fall apart, which is exactly what separates them from bends.',
  },
  {
    id: 'dk-16',
    category: 'deck-seamanship',
    prompt: 'What is the bitter end of a rope?',
    options: [
      'The free end - the last of the rope, the end not made fast or in use',
      'The end permanently spliced to the anchor',
      'The middle of the rope, where it is doubled back',
      'The end that has been whipped to stop it fraying',
    ],
    correctAnswer: 'The free end - the last of the rope, the end not made fast or in use',
    explanation:
      'Rigging: The bitter end is the tail - the end you are left holding. The phrase comes off the bitts an anchor cable was made fast to: run the cable out to the bitter end and there is nothing left to pay out, which is where the everyday saying comes from.',
  },
  {
    id: 'dk-17',
    category: 'deck-seamanship',
    prompt: 'What is the standing part of a rope?',
    options: [
      'The part not being worked - the length between the working end and the bitter end',
      'The part of the rope already made fast to a cleat',
      'The end being used to tie the knot',
      'A loop formed when the rope crosses itself',
    ],
    correctAnswer:
      'The part not being worked - the length between the working end and the bitter end',
    explanation:
      'Rigging: The standing part is the inactive length, as against the working end that is doing the tying. Every knot description depends on the pair: "pass the working end round the standing part" is a sentence that means nothing unless both words are solid.',
  },
  {
    id: 'dk-18',
    category: 'deck-seamanship',
    prompt: 'What is a bight?',
    options: [
      'A curve or slack loop in a rope where the ends do not cross',
      'A loop where the rope crosses over itself',
      'The free end of the rope',
      'A knot tied in the middle of a rope',
    ],
    correctAnswer: 'A curve or slack loop in a rope where the ends do not cross',
    explanation:
      'Rigging: A bight is a U in the rope - a curve with no crossing. Let the two parts cross and it becomes a loop, which is a different word doing different work in a knot. "Tied in the bight" means tied in the middle of the rope without using either end.',
  },
  {
    id: 'dk-19',
    category: 'deck-seamanship',
    prompt: 'What does the lay of a rope refer to?',
    options: [
      'The direction in which its strands are twisted together',
      'The way it is coiled down on deck',
      'The material the rope is made from',
      'The load the rope is rated to carry',
    ],
    correctAnswer: 'The direction in which its strands are twisted together',
    explanation:
      'Rigging: Lay is the twist. Most three-strand rope is right-hand laid, which is why it is coiled clockwise - coil it the other way and it fights you and puts kinks in. Braided rope has no lay in this sense, and coils either way.',
  },
  {
    id: 'dk-20',
    category: 'deck-seamanship',
    prompt: 'What is a hawser?',
    options: [
      'A heavy rope or cable used for towing or mooring',
      'A light line thrown across to another vessel to pass a heavier one',
      'The wire that supports a mast',
      'A rope with a thimble spliced into one end',
    ],
    correctAnswer: 'A heavy rope or cable used for towing or mooring',
    explanation:
      'Rigging: A hawser is the heavy stuff - the rope a vessel is towed or moored by. The light line thrown first, to haul the hawser across with, is a heaving line, and the pipe the cable runs out through in the bow is the hawsehole, named from the same root.',
  },
  {
    id: 'dk-21',
    category: 'deck-seamanship',
    prompt:
      'Why is nylon the usual choice for an anchor rode and for dock lines, rather than polyester or polypropylene?',
    options: [
      'It stretches under load, absorbing shock loads that would otherwise come straight onto the boat',
      'It floats, so it stays clear of the propeller',
      'It has almost no stretch, so the boat is held exactly where she is put',
      'It is the only one of the three that resists sunlight',
    ],
    correctAnswer:
      'It stretches under load, absorbing shock loads that would otherwise come straight onto the boat',
    explanation:
      'Rigging: Nylon\'s elasticity is the point - it takes the snatch out of a rode in a swell and out of dock lines in a wake. Polyester is chosen where stretch is the enemy, on halyards and sheets. Polypropylene floats, which makes it a heaving line or a ski rope, but it is weaker and it degrades in sunlight.',
  },
  {
    id: 'dk-22',
    category: 'deck-seamanship',
    prompt: 'Which rope floats, and what is that useful for?',
    options: [
      'Polypropylene - it makes a heaving line or a rescue line that stays on the surface',
      'Nylon - it makes an anchor rode that will not chafe on the bottom',
      'Polyester - it makes a mooring line that stays clear of the propeller',
      'Manila - it makes a towline that can be seen in the water',
    ],
    correctAnswer:
      'Polypropylene - it makes a heaving line or a rescue line that stays on the surface',
    explanation:
      'Rigging: Polypropylene is the one that floats, which is exactly what you want in a line thrown to someone in the water and exactly what you do not want fouling a propeller. Its weaknesses are strength and sunlight: it is not the rope for a mooring left out all season.',
  },
  {
    id: 'dk-23',
    category: 'deck-seamanship',
    prompt: 'The order "midships" is given. What does the helmsman do?',
    options: [
      'Bring the rudder to the centreline, so there is no rudder angle either way',
      'Steer for the middle of the channel',
      'Take the boat to the middle of her turn and hold it',
      'Move to the middle of the boat to trim her',
    ],
    correctAnswer: 'Bring the rudder to the centreline, so there is no rudder angle either way',
    explanation:
      'Helm orders: Midships is an order about the rudder, not about position - take the angle off and leave the rudder fore and aft. The boat carries on swinging for a while afterwards, which is why the order is given before the heading you want, not when you reach it.',
  },
  {
    id: 'dk-24',
    category: 'deck-seamanship',
    prompt: 'The order "steady as she goes" is given. What does the helmsman do?',
    options: [
      'Hold the heading the boat is on at the moment the order is given, and report that heading',
      'Hold the rudder exactly where it is and change nothing',
      'Return to the heading the boat was on before the last order',
      'Reduce speed until the boat stops swinging',
    ],
    correctAnswer:
      'Hold the heading the boat is on at the moment the order is given, and report that heading',
    explanation:
      'Helm orders: Steady as she goes fixes the heading at the instant of the order - the helmsman notes what is under the lubber line, checks the swing, steers back to it and reports the course. It is an order about a heading; the rudder does whatever is needed to hold it.',
  },
  {
    id: 'dk-25',
    category: 'deck-seamanship',
    prompt: 'The order "shift your rudder" is given. What does the helmsman do?',
    options: [
      'Put on the same amount of rudder on the opposite side',
      'Put the rudder hard over the other way',
      'Bring the rudder to the centreline and wait',
      'Ease the rudder by half and hold it there',
    ],
    correctAnswer: 'Put on the same amount of rudder on the opposite side',
    explanation:
      'Helm orders: Shift your rudder means the same angle, the other way - twenty degrees of right rudder becomes twenty degrees of left. It is a single, unambiguous order for a manoeuvre that would otherwise take two, and it does not mean hard over.',
  },
  {
    id: 'dk-26',
    category: 'deck-seamanship',
    prompt: 'The order "meet her" is given while the boat is swinging. What does the helmsman do?',
    options: [
      'Use rudder the opposite way to check the swing, without turning the boat back',
      'Put the rudder hard over the opposite way to reverse the turn',
      'Centre the rudder and let the swing die out on its own',
      'Hold the present rudder angle until told otherwise',
    ],
    correctAnswer: 'Use rudder the opposite way to check the swing, without turning the boat back',
    explanation:
      'Helm orders: Meet her is enough opposite rudder to stop the swing where it is - the boat carries her turn after the rudder comes off, and this is the order that catches her before she goes past the heading wanted. Ease the rudder, by contrast, only reduces the angle you already have.',
  },
  {
    id: 'dk-27',
    category: 'deck-seamanship',
    prompt: 'What does a helmsman do on receiving a helm order?',
    options: [
      'Repeat the order back word for word, carry it out, and report when it has been carried out',
      'Carry it out and say nothing unless there is a problem',
      'Acknowledge with "aye" and report only if the order cannot be carried out',
      'Repeat the order back only if it differs from the one before it',
    ],
    correctAnswer:
      'Repeat the order back word for word, carry it out, and report when it has been carried out',
    explanation:
      'Helm orders: The order is repeated back so that a mishearing is caught before the rudder moves, and the completion is reported so the conning officer knows the boat is doing what was asked without having to look. Silence at the helm is how a wrong rudder angle survives long enough to matter.',
  },
];

// --- WEATHER AND SEA STATE (25 questions) ---
//
// Not COLREGS, and not seamanship either in the boat-and-gear sense - this and
// tides are the two cards about the ENVIRONMENT rather than the vessel, which
// is why they were split out into their own syllabus section. Three topics
// that are one skill approached three ways: reading what the weather is about
// to do off what can be seen from the deck with no instrument in your hand.
//
//   wx-01 to wx-12   the Beaufort scale                "Beaufort scale"
//   wx-13 to wx-20   what a cloud form foretells       "Cloud reading"
//   wx-21 to wx-25   the sky and the wind shift        "Weather lore"
//
// ON THE SPEED FIGURES. The Beaufort scale is defined by what the SEA does,
// not by an anemometer: force 4 is "small waves, fairly frequent whitecaps",
// and the wind speeds printed beside each force are equivalents fitted to
// those descriptions afterwards. Different tables therefore give slightly
// different cutoffs and neither is wrong. So no question here turns on a
// boundary knot: they ask the name of a force, the sea state at a force, or a
// speed given as "about", with distractors far enough apart that the choice of
// source table cannot decide the answer. wx-12 asks about the discrepancy
// outright, because a candidate who has read two tables has already met it.
//
// Force 9 is "strong gale", which some tables print as "severe gale". It is
// one force under two names, so the two are never offered against each other.

const weatherQuestions: ColregsQuestion[] = [
  {
    id: 'wx-01',
    category: 'weather',
    prompt: 'What does the Beaufort scale measure?',
    options: [
      'Wind force, estimated from its observed effect on the sea and on shore',
      'Wave height in feet, measured from trough to crest',
      'Barometric pressure, read off the ship\'s barometer',
      'The distance a wind has blown over open water',
    ],
    correctAnswer:
      'Wind force, estimated from its observed effect on the sea and on shore',
    explanation:
      'Beaufort scale: It is an observation scale, not an instrument reading. Beaufort wrote it for men who had no anemometer and did have eyes, so every force is defined by what the sea is doing - the wind speeds beside the forces were fitted to those descriptions long afterwards.',
  },
  {
    id: 'wx-02',
    category: 'weather',
    prompt: 'How many forces does the Beaufort scale have?',
    options: [
      '13, numbered 0 to 12',
      '12, numbered 1 to 12',
      '10, numbered 0 to 9',
      '17, numbered 0 to 16',
    ],
    correctAnswer: '13, numbered 0 to 12',
    explanation:
      'Beaufort scale: Thirteen forces, 0 through 12. Counting the names and arriving at twelve is the commonest slip - force 0 is a force, and it is calm. A few national services extend the numbering past 12 for tropical cyclones, but the scale proper stops at hurricane force.',
  },
  {
    id: 'wx-03',
    category: 'weather',
    prompt: 'What is force 0 on the Beaufort scale called?',
    options: ['Calm', 'Light air', 'Slack', 'Still'],
    correctAnswer: 'Calm',
    explanation:
      'Beaufort scale: Force 0 is Calm, under about 1 knot, and the sea is like a mirror. Force 1 is Light air - the first force whose name admits any wind at all.',
  },
  {
    id: 'wx-04',
    category: 'weather',
    prompt: 'The sea is like a mirror, without a ripple anywhere on it. What force is this?',
    options: ['Force 0', 'Force 1', 'Force 2', 'Force 3'],
    correctAnswer: 'Force 0',
    explanation:
      'Beaufort scale: A mirror sea is force 0, Calm. The very first thing wind does to water is raise ripples with the appearance of scales but no foam on them, and that is already force 1.',
  },
  {
    id: 'wx-05',
    category: 'weather',
    prompt: 'What is force 12, the top of the Beaufort scale, called?',
    options: ['Hurricane force', 'Violent storm', 'Severe storm', 'Typhoon force'],
    correctAnswer: 'Hurricane force',
    explanation:
      'Beaufort scale: Force 12 is hurricane force, from about 64 knots up, with the air full of foam and spray and the sea white all over. Violent storm is force 11, one below it. The name says the wind is of hurricane strength; it does not say the system is a hurricane, which is a different question about a different thing.',
  },
  {
    id: 'wx-06',
    category: 'weather',
    prompt: 'What is force 8 called?',
    options: ['Gale', 'Near gale', 'Strong gale', 'Strong breeze'],
    correctAnswer: 'Gale',
    explanation:
      'Beaufort scale: Force 8 is a gale, beginning around 34 knots, with moderately high waves and foam blown in well-marked streaks along the wind. This is the force a gale warning is named for, which is why 34 knots is the most useful threshold on the whole scale.',
  },
  {
    id: 'wx-07',
    category: 'weather',
    prompt: 'What is force 7 called?',
    options: ['Near gale', 'Gale', 'Strong breeze', 'Moderate gale'],
    correctAnswer: 'Near gale',
    explanation:
      'Beaufort scale: Force 7 is a near gale - the sea heaps up and white foam begins to blow in streaks. It is the last force below gale strength, which is why its name keeps pointing at the one above it.',
  },
  {
    id: 'wx-08',
    category: 'weather',
    prompt: 'At roughly what wind speed does force 8, a gale, begin?',
    options: ['About 34 knots', 'About 12 knots', 'About 22 knots', 'About 64 knots'],
    correctAnswer: 'About 34 knots',
    explanation:
      'Beaufort scale: A gale starts at about 34 knots. Take its neighbours with it and the scale has a spine to hang the rest on - about 22 knots at force 6, about 34 at force 8, about 48 at force 10, about 64 at force 12. Tables differ by a knot here and there, which is why these are "about" and not exact.',
  },
  {
    id: 'wx-09',
    category: 'weather',
    prompt: 'At about which force do whitecaps first begin to appear on the sea?',
    options: ['Force 3', 'Force 1', 'Force 6', 'Force 8'],
    correctAnswer: 'Force 3',
    explanation:
      'Beaufort scale: At force 3, a gentle breeze of roughly 7 to 10 knots, the wavelet crests begin to break and scattered whitecaps appear. By force 4 they are fairly frequent and by force 6 the crests are extensive and blowing spray. The first whitecap is the most useful mark on the scale because you can watch it happen.',
  },
  {
    id: 'wx-10',
    category: 'weather',
    prompt: 'What is force 6 called?',
    options: ['Strong breeze', 'Fresh breeze', 'Near gale', 'Moderate breeze'],
    correctAnswer: 'Strong breeze',
    explanation:
      'Beaufort scale: Force 6 is a strong breeze, around 22 to 27 knots, with large waves, extensive white crests and some spray. It is the top of the breezes - force 5 is the fresh breeze below it, and force 7 is the first of the gales in all but name.',
  },
  {
    id: 'wx-11',
    category: 'weather',
    prompt: 'What is force 11 called?',
    options: ['Violent storm', 'Storm', 'Strong gale', 'Hurricane force'],
    correctAnswer: 'Violent storm',
    explanation:
      'Beaufort scale: Force 10 is a storm, force 11 a violent storm, force 12 hurricane force. Force 9, below them, is a strong gale - printed in some tables as a severe gale, which is the same force under another name and not an extra entry on the scale.',
  },
  {
    id: 'wx-12',
    category: 'weather',
    prompt:
      'Two published Beaufort tables give slightly different wind speeds for the same force. What explains this?',
    options: [
      'The forces are defined by observed sea state, and the speeds beside them are fitted equivalents',
      'One of the two tables contains an error and should not be used',
      'One table is in knots and the other is in nautical miles per hour',
      'The scale is revised each year and the older table has expired',
    ],
    correctAnswer:
      'The forces are defined by observed sea state, and the speeds beside them are fitted equivalents',
    explanation:
      'Beaufort scale: The description is the definition and the speed is the gloss, so two tables that fit the equivalents a knot apart are both honest. Knots and nautical miles per hour are the same unit, which rules that answer out by itself. What it means in practice is that the sea is what you are reading, and a boundary knot is never the thing an answer turns on.',
  },
  {
    id: 'wx-13',
    category: 'weather',
    prompt:
      'High, thin, wispy streaks of cloud with hooked tails - mares\' tails - appear. What do they foretell?',
    options: [
      'A change in the weather in roughly 24 hours, but no rain from these clouds themselves',
      'Rain within the hour',
      'Settled fair weather for several days to come',
      'An immediate risk of squalls and lightning',
    ],
    correctAnswer:
      'A change in the weather in roughly 24 hours, but no rain from these clouds themselves',
    explanation:
      'Cloud reading: Cirrus is ice crystal cloud far too high to rain on anybody. It runs out ahead of an approaching system, so it is a warning with about a day\'s notice on it - useful exactly because nothing has happened yet when you see it.',
  },
  {
    id: 'wx-14',
    category: 'weather',
    prompt:
      'Detached heaped clouds with flat bases and bright cauliflower tops drift across a blue sky. What do they indicate?',
    options: [
      'Fair weather',
      'Rain within the hour',
      'An approaching warm front',
      'Fog forming by nightfall',
    ],
    correctAnswer: 'Fair weather',
    explanation:
      'Cloud reading: Scattered fair-weather cumulus is the sky doing nothing worse than convecting on a decent day. What is worth watching is the behaviour rather than the cloud: cumulus that keeps building upward through the afternoon instead of drifting along is on its way to becoming something else.',
  },
  {
    id: 'wx-15',
    category: 'weather',
    prompt:
      'A cloud has grown into a towering dark mass with a flattened, spreading top. What does it mean for a small boat?',
    options: [
      'Immediate danger - squalls, lightning and violent wind shifts',
      'A change of weather in about 24 hours',
      'Steady light rain for the rest of the day',
      'Fair weather with good visibility',
    ],
    correctAnswer: 'Immediate danger - squalls, lightning and violent wind shifts',
    explanation:
      'Cloud reading: That is cumulonimbus, and it is the one cloud form that is an emergency rather than a forecast. It carries lightning, hail, a squall front that can arrive ahead of the rain, and a wind that shifts hard and without warning. Get in, get sail off her, get life jackets on - do not wait to see what it does.',
  },
  {
    id: 'wx-16',
    category: 'weather',
    prompt:
      'The sky fills with small white cloudlets in a rippled, regular pattern - a mackerel sky. What does it foretell?',
    options: [
      'Rain is likely within 24 hours',
      'Settled weather for the next several days',
      'A squall within the hour',
      'The wind is about to drop to a flat calm',
    ],
    correctAnswer: 'Rain is likely within 24 hours',
    explanation:
      'Cloud reading: A mackerel sky is cirrocumulus or altocumulus in ranks, and it goes with the moisture and instability running ahead of a front. "Mackerel sky and mares\' tails make tall ships carry low sails" pairs it with cirrus for the same reason - both are the high leading edge of a system that has not reached you yet.',
  },
  {
    id: 'wx-17',
    category: 'weather',
    prompt: 'A bright ring appears around the sun. What does it usually indicate?',
    options: [
      'An approaching front, with a change of weather to follow',
      'Settled high pressure and continued fair weather',
      'That the wind is about to back suddenly',
      'Fog within the hour',
    ],
    correctAnswer: 'An approaching front, with a change of weather to follow',
    explanation:
      'Cloud reading: A halo is light refracted through ice crystals in a high, thin veil of cloud, and that veil is the leading edge of a front spreading over you. The old saying carries the same observation about the moon - a ring around it means wet weather soon.',
  },
  {
    id: 'wx-18',
    category: 'weather',
    prompt: 'What causes a halo around the sun or the moon?',
    options: [
      'Light refracted through ice crystals in high cloud',
      'Water droplets in fog close to the surface',
      'Dust and salt haze lifted off the sea by strong wind',
      'Smoke from shore held down under an inversion',
    ],
    correctAnswer: 'Light refracted through ice crystals in high cloud',
    explanation:
      'Cloud reading: Ice crystals in a thin, high sheet of cloud bend the light into a ring. That is what makes the halo a forecast at all - it is evidence of high cirrostratus overhead, which is evidence of a front on its way. Neither fog nor haze can produce one.',
  },
  {
    id: 'wx-19',
    category: 'weather',
    prompt: 'Which cloud form calls for action now rather than a forecast for tomorrow?',
    options: ['Cumulonimbus', 'Cirrus', 'Cirrocumulus', 'Fair-weather cumulus'],
    correctAnswer: 'Cumulonimbus',
    explanation:
      'Cloud reading: Cirrus and a mackerel sky are each about a day\'s notice, and fair-weather cumulus is notice of nothing. Cumulonimbus is the exception on the list - the danger is under it and it is minutes away, not tomorrow.',
  },
  {
    id: 'wx-20',
    category: 'weather',
    prompt:
      'A tall storm cloud has spread out into a flat anvil shape at its top. What does the anvil tell you?',
    options: [
      'The cloud has grown to its full height and the storm is at its most dangerous',
      'The cloud is decaying and the danger has passed',
      'The cloud is too high to produce any weather at the surface',
      'The wind at the surface is about to drop away',
    ],
    correctAnswer:
      'The cloud has grown to its full height and the storm is at its most dangerous',
    explanation:
      'Cloud reading: The anvil is the top of the thunderhead meeting stable air it cannot rise through and spreading sideways instead. It marks a mature storm, not a spent one, and the anvil usually leans out ahead of the storm in the direction it is travelling - which is a hint about where it is going.',
  },
  {
    id: 'wx-21',
    category: 'weather',
    prompt: 'What does "red sky at night, sailor\'s delight" traditionally mean?',
    options: [
      'Fair weather is likely, because the clear air is to the west where the weather comes from',
      'A gale is likely before morning',
      'The wind will back overnight',
      'Fog is likely to form before dawn',
    ],
    correctAnswer:
      'Fair weather is likely, because the clear air is to the west where the weather comes from',
    explanation:
      'Weather lore: In middle latitudes weather generally travels west to east. A red sunset is the setting sun lighting departing cloud through clear air away to the westward - and that clear air is what is coming next. It is a rule of thumb, worth something and not worth a forecast.',
  },
  {
    id: 'wx-22',
    category: 'weather',
    prompt: 'What does "red sky at morning, sailors take warning" traditionally mean?',
    options: [
      'Bad weather is likely, because the clear air is to the east and has already gone past',
      'The day will be fair but unusually hot',
      'The tide will run harder than usual',
      'Visibility will be good all day',
    ],
    correctAnswer:
      'Bad weather is likely, because the clear air is to the east and has already gone past',
    explanation:
      'Weather lore: The rising sun in the east lights cloud arriving from the west, and the clear gap it shines through is the good weather leaving astern of it. It is the evening saying run the other way round, off the same reasoning.',
  },
  {
    id: 'wx-23',
    category: 'weather',
    prompt: 'The wind is backing. What is it doing, and what does it suggest?',
    options: [
      'Shifting counterclockwise, suggesting a low pressure system approaching and worsening weather',
      'Shifting clockwise, suggesting high pressure and improving weather',
      'Dropping away steadily towards a calm',
      'Increasing in strength without changing direction',
    ],
    correctAnswer:
      'Shifting counterclockwise, suggesting a low pressure system approaching and worsening weather',
    explanation:
      'Weather lore: Backing is counterclockwise - southwest to south to southeast - and in the northern hemisphere it commonly means a low is coming your way. Read it against the barometer: a backing wind and a falling glass together are worth far more than either on its own.',
  },
  {
    id: 'wx-24',
    category: 'weather',
    prompt: 'The wind is veering. What is it doing, and what does it suggest?',
    options: [
      'Shifting clockwise, suggesting high pressure and generally improving weather',
      'Shifting counterclockwise, suggesting a low approaching',
      'Blowing in gusts from no settled direction',
      'Backing under another name',
    ],
    correctAnswer:
      'Shifting clockwise, suggesting high pressure and generally improving weather',
    explanation:
      'Weather lore: Veering is clockwise - south to southwest to west - and it is the shift that typically follows a front through, with the glass rising behind it. The pair is worth learning as opposites: backing counterclockwise and getting worse, veering clockwise and getting better.',
  },
  {
    id: 'wx-25',
    category: 'weather',
    prompt:
      'The wind has shifted from southwest round to west, and then to northwest. What has it done?',
    options: ['Veered', 'Backed', 'Hauled aft', 'Freshened'],
    correctAnswer: 'Veered',
    explanation:
      'Weather lore: Southwest to west to northwest is clockwise, so the wind has veered. The two words describe which way the shift turns and say nothing at all about strength - a wind can veer and drop, or back and freshen, and the two observations are read separately.',
  },
];

// --- TIDES AND CURRENTS (21 questions) ---
//
// Not COLREGS. Like weather, this is a card about the water rather than about
// the boat, which is what put the two of them in a section of their own. Two
// topics, and the whole card is built around keeping them apart:
//
//   ti-01 to ti-13   the tide, which is vertical         "Tides"
//   ti-14 to ti-21   the tidal current, which is not     "Tidal currents"
//
// The tide is the water going up and down; the tidal current is the water
// going sideways because of it. They are caused by the same thing and they do
// NOT reliably turn at the same moment, and a candidate who has not had that
// separated out will answer half of this card by guessing. That is why the two
// halves carry different labels: the badge under the verdict says which of the
// two the question was actually about.
//
// ENTIRELY TEXT-BASED, ON PURPOSE. There is no honest still picture of a tide.
// Every one of these is a thing that happens over hours - water rising, a
// current turning, a range widening across a fortnight - and the only way to
// draw it is a curve with the axes labelled, which is a diagram of a graph and
// not of the sea. A drawn arrow saying "flood" would be the answer to ti-16
// printed on the page. Fire safety made the same call for the same reason.

const tidesQuestions: ColregsQuestion[] = [
  {
    id: 'ti-01',
    category: 'tides',
    prompt: 'What is a flood tide?',
    options: [
      'The incoming tide, when the water level is rising',
      'The outgoing tide, when the water level is falling',
      'The moment the tide stops before it turns',
      'A tide that has risen higher than predicted',
    ],
    correctAnswer: 'The incoming tide, when the water level is rising',
    explanation:
      'Tides: Flood is the tide coming in and the level rising, from low water up to high water. It has nothing to do with flooding in the sense of water where it should not be - it is simply the name of the half of the cycle in which the tide is making.',
  },
  {
    id: 'ti-02',
    category: 'tides',
    prompt: 'What is an ebb tide?',
    options: [
      'The outgoing tide, when the water level is falling',
      'The incoming tide, when the water level is rising',
      'The lowest level the tide reaches in a month',
      'The pause between one tide and the next',
    ],
    correctAnswer: 'The outgoing tide, when the water level is falling',
    explanation:
      'Tides: Ebb is the tide going out and the level falling, from high water down to low water. Flood and ebb are the two halves of the cycle, and between each of them is the pause the next question is about.',
  },
  {
    id: 'ti-03',
    category: 'tides',
    prompt: 'What is slack water?',
    options: [
      'The brief period around the turn when there is little or no current running',
      'The deepest water in a channel at low tide',
      'Water sheltered from the wind by high ground',
      'The whole period between high water and low water',
    ],
    correctAnswer:
      'The brief period around the turn when there is little or no current running',
    explanation:
      'Tides: Slack water is the short pause as the stream stops before running the other way. It is the easiest water to anchor in, to pick up a mooring in and to cross a busy channel in - and it is short, so it is planned for rather than waited for.',
  },
  {
    id: 'ti-04',
    category: 'tides',
    prompt: 'What is a spring tide?',
    options: [
      'A tide with an unusually large range, at new and full moon',
      'A tide with an unusually small range, at the quarter moons',
      'Any tide occurring in the spring of the year',
      'A tide raised by strong onshore wind rather than by the moon',
    ],
    correctAnswer: 'A tide with an unusually large range, at new and full moon',
    explanation:
      'Tides: Springs are the big tides - higher high water and lower low water, so the greatest range. They come round at new and full moon, roughly twice a month. The name is from the water springing up, not from the season, which is the trap in the wrong answers here.',
  },
  {
    id: 'ti-05',
    category: 'tides',
    prompt: 'What is a neap tide?',
    options: [
      'A tide with an unusually small range, at the quarter moons',
      'A tide with an unusually large range, at new and full moon',
      'The last tide before a storm',
      'A tide that fails to turn at the predicted time',
    ],
    correctAnswer: 'A tide with an unusually small range, at the quarter moons',
    explanation:
      'Tides: Neaps are the small tides - the high water is lower and the low water higher than usual, so the range is least. They fall at the first and last quarter moons, about a week either side of springs.',
  },
  {
    id: 'ti-06',
    category: 'tides',
    prompt: 'At which phases of the moon do spring tides occur?',
    options: [
      'New moon and full moon',
      'First quarter and last quarter',
      'Full moon only',
      'New moon only',
    ],
    correctAnswer: 'New moon and full moon',
    explanation:
      'Tides: At new and full moon the sun, the earth and the moon are in line, so the sun\'s pull adds to the moon\'s and the range is greatest. Both phases give springs, which is why they come about every fortnight rather than once a month.',
  },
  {
    id: 'ti-07',
    category: 'tides',
    prompt: 'At which phases of the moon do neap tides occur?',
    options: [
      'The first and last quarter moons',
      'New moon and full moon',
      'The three days after a full moon',
      'Only when the moon is at its furthest from the earth',
    ],
    correctAnswer: 'The first and last quarter moons',
    explanation:
      'Tides: At the quarters the sun and moon are at right angles as seen from the earth, so their pulls work across each other instead of together and the range is smallest. Springs and neaps alternate about every seven days for that reason.',
  },
  {
    id: 'ti-08',
    category: 'tides',
    prompt: 'Why do spring tides have the largest range?',
    options: [
      'The sun and moon are in line, so their pulls add together',
      'The moon is closest to the earth at those times',
      'The sun and moon are at right angles, so their pulls cancel',
      'The prevailing wind is strongest at new and full moon',
    ],
    correctAnswer: 'The sun and moon are in line, so their pulls add together',
    explanation:
      'Tides: The moon does most of the work and the sun adds roughly half as much again. In line - which is what new and full moon means - the two pull the same way and the range is greatest. The moon\'s distance does vary and does matter, but it is a separate effect and not what makes a tide a spring.',
  },
  {
    id: 'ti-09',
    category: 'tides',
    prompt: 'Why do neap tides have the smallest range?',
    options: [
      'The sun and moon are at right angles, so their pulls work against each other',
      'The sun and moon are in line, so their pulls add together',
      'The moon is furthest from the earth at those times',
      'There is no moon in the sky at all during neaps',
    ],
    correctAnswer:
      'The sun and moon are at right angles, so their pulls work against each other',
    explanation:
      'Tides: At the quarters the sun is pulling across the moon\'s line rather than along it, so it partly cancels what the moon is doing. The high water is lower and the low water higher, and the range can be roughly half what it is at springs.',
  },
  {
    id: 'ti-10',
    category: 'tides',
    prompt: 'What is a king tide?',
    options: [
      'An especially high spring tide, well above the ordinary run of them',
      'The highest tide ever recorded at a given place',
      'A tide raised by a storm surge rather than by the moon',
      'The first spring tide of the calendar year',
    ],
    correctAnswer: 'An especially high spring tide, well above the ordinary run of them',
    explanation:
      'Tides: King tide is a popular rather than a technical term for the highest of the spring tides, when the moon is both new or full and near its closest to the earth. It is still an ordinary predicted tide - what makes it worth a name is that it is the one that floods low-lying docks and ramps on a perfectly calm day.',
  },
  {
    id: 'ti-11',
    category: 'tides',
    prompt: 'What is the range of a tide?',
    options: [
      'The difference in height between high water and the low water beside it',
      'The distance the water moves horizontally up a beach',
      'The height of high water above the charted depth',
      'How far up a river the tide can be felt',
    ],
    correctAnswer:
      'The difference in height between high water and the low water beside it',
    explanation:
      'Tides: Range is the vertical difference between a high water and the low water next to it. It is the figure that changes most between springs and neaps, and it is a height - the horizontal distance the water covers on a flat beach follows from it but is not the same thing.',
  },
  {
    id: 'ti-12',
    category: 'tides',
    prompt: 'On most coasts of the United States, how many high tides are there in a day?',
    options: [
      'Two, roughly every 12 hours and 25 minutes',
      'One, roughly every 24 hours',
      'Four, roughly every 6 hours',
      'It varies daily with the weather',
    ],
    correctAnswer: 'Two, roughly every 12 hours and 25 minutes',
    explanation:
      'Tides: Two highs and two lows a day is the semidiurnal pattern most of the country sees. The extra 25 minutes is why the tide comes later each day - the cycle follows the moon, not the clock. Parts of the Gulf coast run a single daily tide instead, which is why the tide table for the actual place is what you read.',
  },
  {
    id: 'ti-13',
    category: 'tides',
    prompt: 'A spring tide is predicted for late December. Is that possible?',
    options: [
      'Yes - "spring" refers to the water springing up, not to the season',
      'No - spring tides occur only in the spring months',
      'Yes, but only in the southern hemisphere, where the seasons are reversed',
      'No - a tide in December would be a neap by definition',
    ],
    correctAnswer: 'Yes - "spring" refers to the water springing up, not to the season',
    explanation:
      'Tides: Springs come round with the moon roughly every fortnight, all year. The word is the old sense of springing or welling up, as a spring of water does, and has nothing to do with the season - which makes this the most reliable wrong answer on the whole card.',
  },
  {
    id: 'ti-14',
    category: 'tides',
    prompt: 'What is the difference between a tide and a tidal current?',
    options: [
      'A tide is the vertical rise and fall of the water; a tidal current is its horizontal movement',
      'A tide is caused by the moon; a tidal current is caused by the wind',
      'A tide is measured in a harbour; a tidal current is measured at sea',
      'They are two names for the same thing',
    ],
    correctAnswer:
      'A tide is the vertical rise and fall of the water; a tidal current is its horizontal movement',
    explanation:
      'Tidal currents: The tide goes up and down and the current goes sideways. One is a depth and the other is a speed and a direction, and they answer different questions - the tide tells you whether you will float over the bar, the current tells you where the boat is actually going while you steer.',
  },
  {
    id: 'ti-15',
    category: 'tides',
    prompt: 'Does the tidal current always turn at the same moment as high or low water?',
    options: [
      'No - the current can go on running for some time after the tide has turned',
      'Yes - the current turns exactly at high and low water everywhere',
      'Yes, but only during spring tides',
      'No - the current turns exactly halfway between high and low water everywhere',
    ],
    correctAnswer:
      'No - the current can go on running for some time after the tide has turned',
    explanation:
      'Tidal currents: The two are related but not locked together, and how far apart they run depends on the place. In many harbour entrances the stream keeps ebbing well after low water. It is the reason the tables are published separately - a tide table and a current table are two different books, and reading the height when you needed the stream is a real mistake with a real outcome.',
  },
  {
    id: 'ti-16',
    category: 'tides',
    prompt: 'Which way does a flood current run?',
    options: [
      'Toward shore and up into harbours, bays and rivers',
      'Away from shore and out to sea',
      'Along the coast, parallel to the shoreline',
      'Whichever way the wind is blowing at the time',
    ],
    correctAnswer: 'Toward shore and up into harbours, bays and rivers',
    explanation:
      'Tidal currents: A flood current sets inward, carrying water in to raise the level as the tide floods. In a river mouth it runs upstream, which can stop a weak stream or reverse it outright for a few hours.',
  },
  {
    id: 'ti-17',
    category: 'tides',
    prompt: 'Which way does an ebb current run?',
    options: [
      'Seaward, out of harbours, bays and rivers',
      'Shoreward, into harbours and bays',
      'Always downwind',
      'It circles the harbour and does not leave it',
    ],
    correctAnswer: 'Seaward, out of harbours, bays and rivers',
    explanation:
      'Tidal currents: An ebb current sets outward as the water drains away. At a river mouth the ebb runs with the river\'s own flow, so it is usually the stronger of the two streams and the one that builds the worst water on a bar.',
  },
  {
    id: 'ti-18',
    category: 'tides',
    prompt: 'You must anchor in a narrow channel with a strong stream. Which moment is easiest?',
    options: [
      'Slack water, when there is little current to set the boat',
      'The middle of the flood, when the current is at its strongest',
      'The middle of the ebb, when the current is at its strongest',
      'It makes no difference to anchoring',
    ],
    correctAnswer: 'Slack water, when there is little current to set the boat',
    explanation:
      'Tidal currents: At slack the boat stays where you put her while the anchor sets, instead of being carried down over her own cable. The same reasoning applies to picking up a mooring, coming alongside and putting a swimmer in the water - the current is doing nothing for that short window, so the manoeuvre is the only thing you have to think about.',
  },
  {
    id: 'ti-19',
    category: 'tides',
    prompt:
      'A boat makes 6 knots through the water against a 2 knot current. What is her speed over the ground?',
    options: ['4 knots', '8 knots', '6 knots', '3 knots'],
    correctAnswer: '4 knots',
    explanation:
      'Tidal currents: Six through the water less two of foul current is four made good over the ground. Turn round and run with the same stream and you make eight, which is why a passage is planned around the stream rather than against it - the same boat and the same engine can take twice as long.',
  },
  {
    id: 'ti-20',
    category: 'tides',
    prompt: 'Why is "wind against tide" a warning?',
    options: [
      'Wind blowing against the current builds a short, steep and dangerous sea',
      'The two cancel out and leave the water dangerously still',
      'It makes the tide rise higher than predicted',
      'It stops a sailing boat from tacking',
    ],
    correctAnswer:
      'Wind blowing against the current builds a short, steep and dangerous sea',
    explanation:
      'Tidal currents: A stream running into the wind stacks the waves up shorter and steeper than the same wind would raise on still water, and the worst of it is over a bar or in an inlet where the stream runs hardest. The same wind with the tide under it can leave the water almost easy - the wind alone does not tell you what you will find.',
  },
  {
    id: 'ti-21',
    category: 'tides',
    prompt:
      'The chart shows 4 feet of water at a spot and the tide table gives a height of 3 feet at the time you will be there. What depth should you expect?',
    options: [
      'About 7 feet - the height of tide is added to the charted depth',
      'About 4 feet - the charted depth already allows for the tide',
      'About 3 feet - the tide height replaces the charted depth',
      'About 1 foot - the height of tide is subtracted from the charted depth',
    ],
    correctAnswer: 'About 7 feet - the height of tide is added to the charted depth',
    explanation:
      'Tides: A charted sounding is measured down from a datum near the low water mark, so it is close to the worst case rather than what is there now. The height of tide is added to it to get the depth of the moment. Reading the sounding alone is safe; forgetting that the tide can also be falling toward it is what puts a keel in the mud.',
  },
];

// --- SIGNAL FLAGS (20 questions) ---
//
// Signals and communication, not seamanship, and NOT COLREGS: the
// International Code of Signals is an IMO publication in its own right, the
// way IALA is for buoyage, so every explanation here opens with that label
// rather than with a rule number.
//
// WHY FIFTEEN LETTERS AND NOT TWENTY-SIX. The Code gives all twenty-six a
// single-letter meaning, but they are not equally worth knowing: a boat crew
// will meet Alpha, Oscar and Bravo on the water and will not meet Uniform or
// Xray. The fifteen here are the operationally significant ones - the ones
// that say keep clear of me, I am in trouble, someone is in the water, I am
// altering course. Drilling the other eleven to the same depth would spend a
// candidate's attention on the flags least likely to be flying.
//
// sf-01 to sf-15 are the identify direction: here is a flag, what is it
// telling you. Each carries its diagram. sf-16 to sf-20 run the other way or
// ask about the system, and carry none - see the note on QUESTION_FLAGS in
// ../index.tsx.
//
// Echo and India are the pair candidates reverse, and so are Papa and Quebec.
// They are drilled apart rather than against each other, and the explanations
// give the hook rather than just the fact.

const signalFlagQuestions: ColregsQuestion[] = [
  {
    id: 'sf-01',
    category: 'signal-flags',
    prompt: 'A vessel flies a swallow-tailed flag, white at the hoist and blue at the fly. What is she telling you?',
    options: [
      'I have a diver down; keep well clear at slow speed',
      'I am carrying dangerous cargo',
      'I require a pilot',
      'I am altering my course to port',
    ],
    correctAnswer: 'I have a diver down; keep well clear at slow speed',
    explanation:
      'International Code of Signals: Alpha - white at the hoist, blue at the fly, and swallow-tailed. It means a diver is in the water and the vessel cannot manoeuvre, so pass wide and slow. It is not the same as the red-and-white diagonal sport diver flag, which is a United States convention; Alpha is the international one and is the one that carries weight.',
  },
  {
    id: 'sf-02',
    category: 'signal-flags',
    prompt: 'A vessel flies a plain red swallow-tailed flag. What is she telling you?',
    options: [
      'I am taking in, discharging or carrying dangerous goods',
      'I am on fire and need assistance',
      'My vessel is healthy',
      'I am operating astern propulsion',
    ],
    correctAnswer: 'I am taking in, discharging or carrying dangerous goods',
    explanation:
      'International Code of Signals: Bravo - a plain red swallowtail. It flies while explosives, fuel or other dangerous cargo are aboard or being worked, which is why you see it over a fuel dock. The two swallowtails in common use are Alpha and Bravo, and the notch is part of the signal: a solid red rectangle is a different flag entirely.',
  },
  {
    id: 'sf-03',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag of five horizontal bands - blue, white, red, white, blue. What does it mean?',
    options: ['Affirmative - yes', 'Negative - no', 'I require a pilot', 'Man overboard'],
    correctAnswer: 'Affirmative - yes',
    explanation:
      'International Code of Signals: Charlie - five horizontal bands, blue, white, red, white, blue. It is the Code\'s yes. Its opposite is November, and the two of them together, November over Charlie, is a recognised way of saying a vessel is in distress.',
  },
  {
    id: 'sf-04',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag with a broad blue band between two yellow ones. What is she telling you?',
    options: [
      'Keep clear of me; I am manoeuvring with difficulty',
      'I am altering my course to starboard',
      'I have a pilot on board',
      'All persons should report on board',
    ],
    correctAnswer: 'Keep clear of me; I am manoeuvring with difficulty',
    explanation:
      'International Code of Signals: Delta - a blue band between two yellow ones. It says the vessel cannot be relied on to get out of your way, so give her room. Delta is the warning; Foxtrot is the stronger case where she cannot manoeuvre at all.',
  },
  {
    id: 'sf-05',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag divided horizontally, blue over red. What is she telling you?',
    options: [
      'I am altering my course to starboard',
      'I am altering my course to port',
      'I require assistance',
      'I am disabled',
    ],
    correctAnswer: 'I am altering my course to starboard',
    explanation:
      'International Code of Signals: Echo - blue over red - is turning to starboard, and it carries the same message as a single short blast. Its mirror image is India, turning to port. If you learn only one of the pair, learn Echo, and take India as the other one.',
  },
  {
    id: 'sf-06',
    category: 'signal-flags',
    prompt: 'A vessel flies a white flag with a red diamond in the centre. What is she telling you?',
    options: [
      'I am disabled; communicate with me',
      'I require a pilot',
      'I am carrying dangerous goods',
      'My vessel is healthy',
    ],
    correctAnswer: 'I am disabled; communicate with me',
    explanation:
      'International Code of Signals: Foxtrot - a red diamond on white. The vessel has lost the ability to manoeuvre and wants to be spoken to. It is a step past Delta, which only asks for room.',
  },
  {
    id: 'sf-07',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag of six vertical stripes, yellow and blue alternating. What is she asking for?',
    options: [
      'I require a pilot',
      'I have a pilot on board',
      'I am altering my course to port',
      'Man overboard',
    ],
    correctAnswer: 'I require a pilot',
    explanation:
      'International Code of Signals: Golf - six vertical stripes, yellow and blue. It asks for a pilot to be sent. Hotel is its answer, flown once the pilot is aboard, and the pair is worth learning together because a harbour approach is where both actually fly.',
  },
  {
    id: 'sf-08',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag divided vertically, white at the hoist and red at the fly. What is she telling you?',
    options: [
      'I have a pilot on board',
      'I require a pilot',
      'I am about to proceed to sea',
      'Keep clear of me',
    ],
    correctAnswer: 'I have a pilot on board',
    explanation:
      'International Code of Signals: Hotel - white at the hoist, red at the fly. The pilot is aboard and conning her. Golf asked for him; Hotel says he has arrived.',
  },
  {
    id: 'sf-09',
    category: 'signal-flags',
    prompt: 'A vessel flies a yellow flag with a black disc in the centre. What is she telling you?',
    options: [
      'I am altering my course to port',
      'I am altering my course to starboard',
      'I am disabled',
      'Affirmative - yes',
    ],
    correctAnswer: 'I am altering my course to port',
    explanation:
      'International Code of Signals: India - a black disc on yellow - is turning to port, and matches the two short blasts that say the same thing. Echo is the starboard half of the pair. Getting the two the wrong way round is the commonest mistake on this whole card.',
  },
  {
    id: 'sf-10',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag of blue and white squares in a chequer. What does it mean?',
    options: ['Negative - no', 'Affirmative - yes', 'Man overboard', 'I require a pilot'],
    correctAnswer: 'Negative - no',
    explanation:
      'International Code of Signals: November - blue and white squares in a chequer. It is the Code\'s no, and the opposite of Charlie. Flown above Charlie it becomes something else again: the two together are a signal of distress.',
  },
  {
    id: 'sf-11',
    category: 'signal-flags',
    prompt: 'A vessel flies a flag divided corner to corner, red above and yellow below. What is she telling you?',
    options: [
      'Man overboard',
      'I am disabled',
      'I require free pratique',
      'I am about to proceed to sea',
    ],
    correctAnswer: 'Man overboard',
    explanation:
      'International Code of Signals: Oscar - red and yellow divided corner to corner. Somebody is in the water. Of every flag in the Code this is the one to know on sight, because it is the one that means a boat near you needs every pair of eyes it can get, right now.',
  },
  {
    id: 'sf-12',
    category: 'signal-flags',
    prompt: 'A vessel in harbour flies a blue flag with a white rectangle in the centre. What is she telling her crew?',
    options: [
      'All persons should report on board; the vessel is about to proceed to sea',
      'My vessel is healthy and I request free pratique',
      'I have a pilot on board',
      'I am operating astern propulsion',
    ],
    correctAnswer:
      'All persons should report on board; the vessel is about to proceed to sea',
    explanation:
      'International Code of Signals: Papa - a white rectangle on blue - is the Blue Peter, and it is the signal to get everyone back aboard because she is sailing. That is the harbour meaning; at sea the same flag is used by a fishing vessel whose nets are fast on an obstruction.',
  },
  {
    id: 'sf-13',
    category: 'signal-flags',
    prompt: 'A vessel newly arrived from abroad flies a plain yellow flag. What is she telling you?',
    options: [
      'My vessel is healthy and I request free pratique',
      'I am carrying dangerous goods',
      'I require assistance',
      'Negative - no',
    ],
    correctAnswer: 'My vessel is healthy and I request free pratique',
    explanation:
      'International Code of Signals: Quebec - plain yellow. It is flown on arrival from abroad to declare no sickness aboard and ask for clearance to land. Free pratique is that clearance, and the flag comes down when it is granted.',
  },
  {
    id: 'sf-14',
    category: 'signal-flags',
    prompt: 'A vessel flies a white flag with a blue rectangle in the centre. What is she telling you?',
    options: [
      'I am operating astern propulsion',
      'I am altering my course to starboard',
      'I require a pilot',
      'I am disabled',
    ],
    correctAnswer: 'I am operating astern propulsion',
    explanation:
      'International Code of Signals: Sierra - a blue rectangle on white. She is going astern, or at least her engines are, which matters most where a ship is backing out of a berth. It carries the message that three short blasts do.',
  },
  {
    id: 'sf-15',
    category: 'signal-flags',
    prompt: 'A vessel flies a white flag with a red diagonal cross on it. What is she telling you?',
    options: [
      'I require assistance',
      'I require a pilot',
      'I am carrying dangerous goods',
      'Keep clear of me',
    ],
    correctAnswer: 'I require assistance',
    explanation:
      'International Code of Signals: Victor - a red saltire on white. It asks for help, without saying the vessel is in danger of being lost; the signals that say that are a separate list. A red X on white is worth remembering as a plain call for assistance.',
  },
  {
    id: 'sf-16',
    category: 'signal-flags',
    prompt: 'What is the International Code of Signals for?',
    options: [
      'Passing safety messages between vessels that share no common language',
      'Identifying a vessel\'s nationality and home port',
      'Recording the movements of a vessel in her log',
      'Ranking vessels in order of responsibility to keep clear',
    ],
    correctAnswer:
      'Passing safety messages between vessels that share no common language',
    explanation:
      'International Code of Signals: The Code exists so that a message about safety can pass between a Greek ship and a Japanese one without either crew speaking the other\'s language. Each signal has one meaning, published identically in every edition, and each edition prints it in its own language. Nationality is what an ensign shows, which is a different flag doing a different job.',
  },
  {
    id: 'sf-17',
    category: 'signal-flags',
    prompt: 'What does it mean when a single letter flag is flown by itself?',
    options: [
      'It carries a complete meaning of its own, and those meanings are the most urgent in the Code',
      'It is the first letter of a longer signal still being hoisted',
      'It is the initial of the vessel\'s name',
      'It has no meaning until a second flag is hoisted under it',
    ],
    correctAnswer:
      'It carries a complete meaning of its own, and those meanings are the most urgent in the Code',
    explanation:
      'International Code of Signals: The single-letter signals were chosen as the most urgent and the most common, precisely so that one flag can say the whole thing. Two-letter and three-letter groups exist for longer messages, but a lone flag is a finished signal, not the start of one.',
  },
  {
    id: 'sf-18',
    category: 'signal-flags',
    prompt: 'You see a vessel flying a flag meaning she has a diver in the water. What must you do?',
    options: [
      'Keep well clear of her and pass at slow speed',
      'Stand on, since a vessel with a diver down keeps clear of you',
      'Sound one prolonged blast and hold your course',
      'Anchor until the diver is recovered',
    ],
    correctAnswer: 'Keep well clear of her and pass at slow speed',
    explanation:
      'International Code of Signals: That is Alpha, and the point of it is that a person is under the surface where your propeller is. Keep well off and slow down - your wake and your propeller are both the hazard, and the diver cannot see or hear you coming.',
  },
  {
    id: 'sf-19',
    category: 'signal-flags',
    prompt: 'Which single flag is flown to signal a man overboard?',
    options: ['Oscar', 'Victor', 'Delta', 'November'],
    correctAnswer: 'Oscar',
    explanation:
      'International Code of Signals: Oscar means man overboard - the O of "Oh no, someone is in the water" is as good a hook as any, and it is the one flag on this card worth knowing cold. Victor asks for assistance generally, Delta asks for room, and November is simply no.',
  },
  {
    id: 'sf-20',
    category: 'signal-flags',
    prompt: 'Which flag is known as the Blue Peter?',
    options: ['Papa', 'Bravo', 'Sierra', 'Quebec'],
    correctAnswer: 'Papa',
    explanation:
      'International Code of Signals: Papa is the Blue Peter, hoisted in harbour to call everyone back aboard because the vessel is about to sail. The nickname is old and its origin is disputed; what is not disputed is what it means when it goes up, which is that you have run out of time ashore.',
  },
];

// --- COMBINED EXPORT ---

export const COLREGS_QUESTIONS: ColregsQuestion[] = [
  ...navigationLightsQuestions,
  ...soundSignalsQuestions,
  ...vesselHierarchyQuestions,
  ...dayShapesQuestions,
  ...vesselTypesQuestions,
  ...anchorTypesQuestions,
  ...buoyageQuestions,
  ...chartSymbolsQuestions,
  ...distressSignalsQuestions,
  ...vhfProcedureQuestions,
  ...pfdTypesQuestions,
  ...fireSafetyQuestions,
  ...deckSeamanshipQuestions,
  ...weatherQuestions,
  ...tidesQuestions,
  ...signalFlagQuestions,
];

export const COLREGS_QUESTIONS_BY_CATEGORY: Record<ColregsCategory, ColregsQuestion[]> = {
  'navigation-lights': navigationLightsQuestions,
  'sound-signals': soundSignalsQuestions,
  'vessel-hierarchy': vesselHierarchyQuestions,
  'day-shapes': dayShapesQuestions,
  'vessel-types': vesselTypesQuestions,
  'anchor-types': anchorTypesQuestions,
  'buoyage': buoyageQuestions,
  'chart-symbols': chartSymbolsQuestions,
  'distress-signals': distressSignalsQuestions,
  'vhf-procedure': vhfProcedureQuestions,
  'pfd-types': pfdTypesQuestions,
  'fire-safety': fireSafetyQuestions,
  'deck-seamanship': deckSeamanshipQuestions,
  'weather': weatherQuestions,
  'tides': tidesQuestions,
  'signal-flags': signalFlagQuestions,
};

export const CATEGORY_LABELS: Record<ColregsCategory, string> = {
  'navigation-lights': 'Navigation Lights',
  'sound-signals': 'Sound Signals',
  'vessel-hierarchy': 'Vessel Hierarchy',
  'day-shapes': 'Day Shapes',
  'vessel-types': 'Vessel Types',
  'anchor-types': 'Anchor Types',
  'buoyage': 'Buoyage',
  'chart-symbols': 'Chart Symbols',
  'distress-signals': 'Distress Signals',
  'vhf-procedure': 'VHF Procedure',
  'pfd-types': 'PFD Types',
  'fire-safety': 'Fire Safety',
  'deck-seamanship': 'Deck Seamanship',
  'weather': 'Weather and Sea State',
  'tides': 'Tides and Currents',
  'signal-flags': 'Signal Flags',
};
