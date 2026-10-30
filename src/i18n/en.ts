import type { ObstacleKind } from '../level-types.ts';

export const en = {
  appName: 'Drive Practice',
  rotateNote: 'Turn your phone or tablet sideways to drive.',
  starsLabel: (filled: number, total: number) => `${filled} of ${total} stars`,

  home: {
    intro: 'Short, calm exercises for tight spaces, parking and reversing. See exactly where every wheel goes.',
    progress: (stars: number, total: number) => `${stars} of ${total} stars`,
    language: 'Language',
    wheelOnLeft: 'Steering wheel on the left',
    wheelOnRight: 'Steering wheel on the right',
    start: 'Start',
    playAgain: 'Play again',
    lockedNote: 'Finish the level before this one to unlock it.',
  },

  levelOf: (chapter: string, number: number) => `${chapter}, level ${number}`,
  levelOfTotal: (chapter: string, number: number, total: number) => `${chapter}, level ${number} of ${total}`,

  hud: {
    levels: 'Levels',
    guides: 'Guides',
    trail: 'Trail',
    wholeArea: 'Whole area',
    followCar: 'Follow car',
    slow: 'Slow',
    restart: 'Restart',
    menu: 'Options',
    tips: 'Tips',
    frontWheels: 'Front wheels',
    straight: 'Straight',
    steerLeft: (degrees: number) => `${degrees}° left`,
    steerRight: (degrees: number) => `${degrees}° right`,
    time: 'Time',
    touches: 'Touches',
    speedUnit: 'km/h',
    keyHint: 'W gas · S brake · R/D/P gear',
  },

  controls: {
    steeringWheel: 'Steering wheel',
    gear: 'Gear',
    park: 'Park',
    reverse: 'Reverse',
    drive: 'Drive',
    gas: 'Gas',
    brake: 'Brake',
  },

  legend: {
    title: 'Guide lines',
    rear: 'Back wheels',
    front: 'Front wheels',
    swing: 'Front corner swing',
    pivot: 'Turning point',
    pivotLabel: 'turning point',
  },

  hints: {
    chooseGear: 'Choose D to drive forward or R to reverse.',
    holdStill: 'Hold still...',
    linedUp: 'Lined up. Hold the brake to finish.',
    almost: 'Almost. Straighten the car to match the arrow in the box.',
    driveGap: (number: number, total: number) => `Drive through the marked gap ${number} of ${total}.`,
  },

  toasts: {
    stopFirst: 'Stop the car first, then change gear.',
    gapDone: (number: number, total: number) => `Gap ${number} of ${total} done.`,
    allGapsDone: 'All gaps done. Now head for the box.',
  },

  bump: {
    into: {
      kerb: 'Gentle bump into the kerb.',
      wall: 'Gentle bump into the wall.',
      hedge: 'Gentle bump into the hedge.',
      building: 'Gentle bump into the building.',
      car: 'Gentle bump into a parked car.',
      cone: 'Gentle bump into a cone.',
      pillar: 'Gentle bump into a pillar.',
      post: 'Gentle bump into a gate post.',
      planter: 'Gentle bump into a tree.',
      edge: 'Gentle bump into the edge of the practice area.',
    } satisfies Record<ObstacleKind, string>,
    allowed: (touches: number, limit: number) => `That is ${touches} of ${limit} touches allowed.`,
    backOff: 'Back off a little and try again.',
    insideRear: 'The back of the car cut inside the corner. The back wheels take a tighter line than the front ones, so drive a little further before you turn.',
    frontSwing: 'The front corner swung out wide. When you turn, the front of the car swings out past the wheels, so leave more room on the outside.',
    frontSwingReverse: 'The front swung out while you reversed. When you reverse and turn, the front moves the other way, so keep an eye on that side.',
  },

  intro: {
    allowedTouches: (limit: number) => `Allowed touches: ${limit}.`,
    startDriving: 'Start driving',
    howTurningWorks: 'How turning works',
  },

  result: {
    perfect: 'Perfect',
    nicelyDone: 'Nicely done',
    madeIt: 'You made it',
    time: 'Time',
    touches: 'Touches',
    position: 'Position',
    aimFor: (time: string) => `aim for ${time}`,
    noTouches: 'No touches',
    touchCount: (touches: number) => (touches === 1 ? '1 touch' : `${touches} touches`),
    great: 'Neatly lined up',
    good: 'Lined up',
    crooked: 'A little crooked',
    tryAgain: 'Try again',
    allLevels: 'All levels',
    nextLevel: 'Next level',
    failTitle: 'Let’s try that one again',
    failBody: 'That was one touch too many for this spot. Take it slower and lean on the guide lines.',
  },

  lesson: {
    title: 'How turning works',
    steps: {
      paths: 'When you turn right, the back wheels (blue) cut inside the front wheels (white), and the front corner (yellow) swings out wide.',
      pillarHit: 'Turn too early next to a pillar and the front gets past, but the back door hits it.',
      pillarClear: 'Drive further forward before you turn, and the back of the car clears the pillar too.',
      reverse: 'When you reverse and turn, the back goes where you steer and the front swings out the other way.',
    },
    stepOf: (number: number, total: number) => `${number} of ${total}`,
    replay: 'Replay',
    back: 'Back',
    next: 'Next',
    done: 'Got it',
  },

  chapters: {
    basics: {
      title: 'Getting to know the car',
      summary: 'Gas, brake, steering and reverse in an empty space.',
    },
    turning: {
      title: 'Turning',
      summary: 'Corners, gates and tight bends. Watch the back wheels cut in.',
    },
    reversing: {
      title: 'Reversing',
      summary: 'Backing around corners and into tight openings.',
    },
    parking: {
      title: 'Parking',
      summary: 'Supermarket bays, angled spaces and parallel parking on a street.',
    },
    'tight-spots': {
      title: 'Tight everyday spots',
      summary: 'Dead ends, garages, ramps and awkward neighbours.',
    },
  },

  levels: {
    'stop-on-the-line': {
      title: 'Drive and stop',
      goal: 'Drive forward and stop with the whole car inside the green box.',
      tips: [
        'Tap D to choose Drive.',
        'Let go of the gas and the car keeps creeping forward, just like a real automatic.',
        'Hold the brake to stop inside the box.',
      ],
    },
    'gentle-curve': {
      title: 'A gentle curve',
      goal: 'Follow the road around the bend and stop in the box.',
      tips: [
        'Turn the wheel a little and hold it there. The car follows a steady curve.',
        'The blue lines show where your back wheels will go.',
        'Straighten the wheel as the road straightens.',
      ],
    },
    'full-circle': {
      title: 'Full lock circle',
      goal: 'Drive one full circle around the island and stop back in the box.',
      tips: [
        'Turn the wheel all the way to the left and keep it there.',
        'The yellow line shows the front corner swinging wide on the outside.',
        'The back wheels draw a smaller circle than the front wheels.',
      ],
    },
    'reverse-straight': {
      title: 'Reverse into a box',
      goal: 'Reverse back into the painted box and stop.',
      tips: [
        'Tap R for Reverse. The car rolls slowly backwards.',
        'The blue lines show where the back of the car is heading.',
        'Keep the wheel almost straight and make small fixes.',
      ],
    },
    'street-corner': {
      title: 'Turn at a street corner',
      goal: 'Turn right into the side street without touching the kerb.',
      tips: [
        'Drive a little past the corner before you turn.',
        'The back wheels cut inside the front wheels, so watch the inner kerb.',
        'Straighten the wheel as the car lines up with the new street.',
      ],
    },
    'pillar-turn': {
      title: 'Turn past a pillar',
      goal: 'Turn right into the next aisle without touching the pillar on the corner.',
      tips: [
        'Keep driving until your seat has passed the pillar, then turn.',
        'Turn too early and the back door clips the pillar, even after the front got past.',
        'Watch the blue lines: they show where the back wheels will go.',
      ],
    },
    'narrow-gate': {
      title: 'Through a narrow gate',
      goal: 'Turn through the gate into the yard and stop in the box.',
      tips: [
        'Keep to the far side of the road so you have room to swing in.',
        'Start turning a little before you reach the gate.',
        'Line up straight before the posts, then drive through slowly.',
      ],
    },
    'cone-slalom': {
      title: 'Cone slalom',
      goal: 'Weave left and right of the cones through each marked gap.',
      tips: [
        'Small, early wheel turns work better than big, late ones.',
        'Start turning back before you reach each cone.',
        'Watch the yellow line: the front corner swings out wider than you expect.',
      ],
    },
    'u-turn': {
      title: 'U-turn in a wide street',
      goal: 'Turn around in one go and stop in the box on the other side.',
      tips: [
        'Start from the right side of the road to get the widest turn.',
        'Turn the wheel fully left before you start rolling.',
        'Watch the front corner near the far kerb.',
      ],
    },
    'reverse-corner': {
      title: 'Reverse around a corner',
      goal: 'Reverse around the corner into the side street.',
      tips: [
        'When reversing, turn the wheel the way you want the back of the car to go.',
        'Start turning when the back wheels reach the corner.',
        'The front of the car swings the other way, so keep an eye on it.',
      ],
    },
    'reverse-driveway': {
      title: 'Reverse into a driveway',
      goal: 'Back into the driveway between the gate posts.',
      tips: [
        'Drive past the driveway, stop, then choose R.',
        'Turn the wheel toward the driveway to send the back of the car in.',
        'Straighten up once the car points along the driveway.',
      ],
    },
    'reverse-out': {
      title: 'Reverse out of a space',
      goal: 'Back out of the parking space and drive off along the lane.',
      tips: [
        'Reverse straight until your front bumper is clear of the cars beside you.',
        'Then turn so the back of the car swings toward where you came from.',
        'The front swings out toward the next car, so watch the yellow line.',
      ],
    },
    'bay-forward': {
      title: 'Park forwards in a bay',
      goal: 'Drive forwards into the empty space on the left.',
      tips: [
        'Keep to the right side of the lane to get a wider swing.',
        'Turn fully when your front bumper passes the near line of the space.',
        'The back wheels cut the corner, so watch the car on the inside.',
      ],
    },
    'bay-reverse': {
      title: 'Reverse into a bay',
      goal: 'Back into the empty space on the left, between the two cars.',
      tips: [
        'Drive on until the space is about one car length behind you.',
        'Choose R and turn the wheel fully left to send the back into the space.',
        'Straighten the wheel when the car is parallel with the lines.',
      ],
    },
    'angled-bay': {
      title: 'Angled parking',
      goal: 'Turn into the empty angled space.',
      tips: [
        'Angled spaces need only a gentle turn.',
        'Start turning when your seat is level with the near line of the space.',
        'Straighten the wheel as the car lines up with the space.',
      ],
    },
    'parallel-park': {
      title: 'Parallel parking',
      goal: 'Reverse into the gap between the two parked cars, close to the kerb.',
      tips: [
        'Stop beside the front car with your back bumpers level.',
        'Reverse with the wheel fully right until the car sits at about 45 degrees.',
        'Then turn fully left and keep reversing to bring the front in.',
      ],
    },
    'leave-parallel': {
      title: 'Leaving a parallel space',
      goal: 'Pull out of the space and into the lane ahead.',
      tips: [
        'Reverse a little first to give yourself room in front.',
        'Turn the wheel fully left before you move forward.',
        'Watch the yellow line clear the car in front, and the back swing toward the kerb.',
      ],
    },
    'three-point-turn': {
      title: 'Three-point turn',
      goal: 'Turn around in the dead-end street and stop in the box.',
      tips: [
        'Forward with the wheel fully left, stop before the kerb.',
        'Reverse with the wheel fully right, stop before the other kerb.',
        'Then forward again. You can turn the wheel while the car stands still.',
      ],
    },
    'garage-pillars': {
      title: 'Underground garage',
      goal: 'Reverse into the space next to the pillar.',
      tips: [
        'Pillars sit inside the space, so the opening is narrower than the lines.',
        'Drive a bit further past the space than usual before reversing.',
        'Watch the back corner of the car pass the pillar.',
      ],
    },
    'home-garage': {
      title: 'Narrow home garage',
      goal: 'Drive into the garage and stop before the back wall.',
      tips: [
        'Line the car up while you still have room in the driveway.',
        'Use small wheel movements, then let the car roll straight.',
        'Creep in slowly and stop before the back wall.',
      ],
    },
    'ramp-turn': {
      title: 'Car park ramp',
      goal: 'Follow the ramp around the half circle and stop in the box.',
      tips: [
        'Keep a steady, gentle speed and hold the wheel still through the bend.',
        'Stay in the middle: the front corner swings out and the back wheels cut in.',
        'Straighten the wheel as you come out of the bend.',
      ],
    },
    'crooked-neighbour': {
      title: 'Badly parked neighbour',
      goal: 'Reverse into the space next to the car parked over the line.',
      tips: [
        'The car on your right is over the line, so keep a little closer to the car on your left.',
        'Plan your turn the same way as a normal bay.',
        'This one counts: more than two touches and you try again.',
      ],
    },
  },
};

export type Messages = typeof en;
export type LevelId = keyof Messages['levels'];
export type ChapterId = keyof Messages['chapters'];
