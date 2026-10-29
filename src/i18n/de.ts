import type { ObstacleKind } from '../level-types.ts';
import type { Messages } from './en.ts';

export const de: Messages = {
  appName: 'Fahrtraining',
  rotateNote: 'Dreh dein Handy oder Tablet quer, um zu fahren.',
  starsLabel: (filled: number, total: number) => `${filled} von ${total} Sternen`,

  home: {
    intro: 'Kurze, ruhige Übungen für enge Stellen, Einparken und Rückwärtsfahren. Du siehst genau, wo jedes Rad entlangfährt.',
    progress: (stars: number, total: number) => `${stars} von ${total} Sternen`,
    language: 'Sprache',
    wheelOnLeft: 'Lenkrad links',
    wheelOnRight: 'Lenkrad rechts',
    start: 'Starten',
    playAgain: 'Nochmal fahren',
    lockedNote: 'Schließ zuerst das Level davor ab, um dieses freizuschalten.',
  },

  levelOf: (chapter: string, number: number) => `${chapter}, Level ${number}`,
  levelOfTotal: (chapter: string, number: number, total: number) => `${chapter}, Level ${number} von ${total}`,

  hud: {
    levels: 'Level',
    guides: 'Linien',
    trail: 'Spur',
    wholeArea: 'Ganzer Bereich',
    followCar: 'Auto folgen',
    slow: 'Langsam',
    restart: 'Neustart',
    menu: 'Optionen',
    tips: 'Tipps',
    nextTip: 'Nächster Tipp',
    frontWheels: 'Vorderräder',
    straight: 'Gerade',
    steerLeft: (degrees: number) => `${degrees}° links`,
    steerRight: (degrees: number) => `${degrees}° rechts`,
    time: 'Zeit',
    touches: 'Berührungen',
    speedUnit: 'km/h',
    keyHint: 'W Gas · S Bremse · R/D/P Gang',
  },

  controls: {
    steeringWheel: 'Lenkrad',
    gear: 'Gang',
    park: 'Parken',
    reverse: 'Rückwärts',
    drive: 'Fahren',
    gas: 'Gas',
    brake: 'Bremse',
  },

  legend: {
    title: 'Hilfslinien',
    rear: 'Hinterräder',
    front: 'Vorderräder',
    swing: 'Vordere Ecke',
    pivot: 'Drehpunkt',
    pivotLabel: 'Drehpunkt',
  },

  hints: {
    chooseGear: 'Wähle D, um vorwärts zu fahren, oder R für rückwärts.',
    holdStill: 'Stehen bleiben...',
    linedUp: 'Gut ausgerichtet. Halte die Bremse, um abzuschließen.',
    almost: 'Fast. Richte das Auto so aus wie den Pfeil im Feld.',
    driveGap: (number: number, total: number) => `Fahr durch die markierte Lücke ${number} von ${total}.`,
  },

  toasts: {
    stopFirst: 'Halte zuerst an, dann wechsle den Gang.',
    gapDone: (number: number, total: number) => `Lücke ${number} von ${total} geschafft.`,
    allGapsDone: 'Alle Lücken geschafft. Jetzt ab ins Feld.',
  },

  bump: {
    into: {
      kerb: 'Leicht an den Bordstein gestoßen.',
      wall: 'Leicht an die Wand gestoßen.',
      hedge: 'Leicht an die Hecke gestoßen.',
      building: 'Leicht an das Gebäude gestoßen.',
      car: 'Leicht an ein parkendes Auto gestoßen.',
      cone: 'Leicht an ein Hütchen gestoßen.',
      pillar: 'Leicht an eine Säule gestoßen.',
      post: 'Leicht an einen Torpfosten gestoßen.',
      planter: 'Leicht an einen Baum gestoßen.',
      edge: 'Leicht an den Rand des Übungsplatzes gestoßen.',
    } satisfies Record<ObstacleKind, string>,
    allowed: (touches: number, limit: number) => `Das war Berührung ${touches} von ${limit} erlaubten.`,
    backOff: 'Fahr ein kleines Stück weg und versuch es nochmal.',
    insideRear: 'Das Heck hat die Ecke geschnitten. Die Hinterräder fahren eine engere Linie als die Vorderräder, also fahr etwas weiter vor, bevor du einlenkst.',
    frontSwing: 'Die vordere Ecke ist weit ausgeschwenkt. Beim Lenken schwenkt die Front über die Räder hinaus nach außen, also lass außen mehr Platz.',
    frontSwingReverse: 'Die Front ist beim Rückwärtsfahren ausgeschwenkt. Wenn du rückwärts lenkst, bewegt sich die Front zur anderen Seite, also behalte diese Seite im Blick.',
  },

  intro: {
    allowedTouches: (limit: number) => `Erlaubte Berührungen: ${limit}.`,
    startDriving: 'Losfahren',
    howTurningWorks: 'Kurven verstehen',
  },

  result: {
    perfect: 'Perfekt',
    nicelyDone: 'Gut gemacht',
    madeIt: 'Geschafft',
    time: 'Zeit',
    touches: 'Berührungen',
    position: 'Position',
    aimFor: (time: string) => `Ziel: ${time}`,
    noTouches: 'Keine Berührung',
    touchCount: (touches: number) => (touches === 1 ? '1 Berührung' : `${touches} Berührungen`),
    great: 'Sauber ausgerichtet',
    good: 'Ausgerichtet',
    crooked: 'Etwas schief',
    tryAgain: 'Nochmal versuchen',
    allLevels: 'Alle Level',
    nextLevel: 'Nächstes Level',
    failTitle: 'Versuchen wir das nochmal',
    failBody: 'Das war eine Berührung zu viel für diese Stelle. Fahr langsamer und verlass dich auf die Hilfslinien.',
  },

  lesson: {
    title: 'Kurven verstehen',
    steps: {
      paths: 'Wenn du rechts abbiegst, fahren die Hinterräder (blau) weiter innen als die Vorderräder (weiß), und die vordere Ecke (gelb) schwenkt weit nach außen.',
      pillarHit: 'Lenkst du neben einer Säule zu früh ein, kommt die Front zwar vorbei, aber die hintere Tür stößt an.',
      pillarClear: 'Fahr weiter vor, bevor du einlenkst, dann kommt auch das Heck an der Säule vorbei.',
      reverse: 'Wenn du rückwärts lenkst, fährt das Heck dorthin, wohin du lenkst, und die Front schwenkt zur anderen Seite aus.',
    },
    stepOf: (number: number, total: number) => `${number} von ${total}`,
    replay: 'Nochmal',
    back: 'Zurück',
    next: 'Weiter',
    done: 'Verstanden',
  },

  chapters: {
    basics: {
      title: 'Das Auto kennenlernen',
      summary: 'Gas, Bremse, Lenken und Rückwärtsgang auf einer freien Fläche.',
    },
    turning: {
      title: 'Abbiegen',
      summary: 'Ecken, Tore und enge Kurven. Achte darauf, wie die Hinterräder innen schneiden.',
    },
    reversing: {
      title: 'Rückwärtsfahren',
      summary: 'Rückwärts um Ecken und in enge Einfahrten.',
    },
    parking: {
      title: 'Einparken',
      summary: 'Parkplätze am Supermarkt, Schrägparklücken und Längsparken an der Straße.',
    },
    'tight-spots': {
      title: 'Enge Stellen im Alltag',
      summary: 'Sackgassen, Garagen, Rampen und schwierige Nachbarn.',
    },
  },

  levels: {
    'stop-on-the-line': {
      title: 'Fahren und anhalten',
      goal: 'Fahr vorwärts und halte so an, dass das ganze Auto im grünen Feld steht.',
      tips: [
        'Tippe auf D für Fahren.',
        'Lässt du das Gas los, rollt das Auto langsam weiter, genau wie ein echtes Automatikauto.',
        'Halte die Bremse, um im Feld anzuhalten.',
      ],
    },
    'gentle-curve': {
      title: 'Eine sanfte Kurve',
      goal: 'Folge der Straße durch die Kurve und halte im Feld an.',
      tips: [
        'Dreh das Lenkrad ein wenig und halte es so. Das Auto fährt einen gleichmäßigen Bogen.',
        'Die blauen Linien zeigen, wo deine Hinterräder entlangfahren.',
        'Dreh das Lenkrad zurück, wenn die Straße wieder gerade wird.',
      ],
    },
    'full-circle': {
      title: 'Kreis mit Volleinschlag',
      goal: 'Fahr einen ganzen Kreis um die Insel und halte wieder im Feld an.',
      tips: [
        'Schlag das Lenkrad voll nach links ein und halte es dort.',
        'Die gelbe Linie zeigt, wie die vordere Ecke außen weit ausschwenkt.',
        'Die Hinterräder fahren einen kleineren Kreis als die Vorderräder.',
      ],
    },
    'reverse-straight': {
      title: 'Rückwärts ins Feld',
      goal: 'Fahr rückwärts in das aufgemalte Feld und halte an.',
      tips: [
        'Tippe auf R für Rückwärts. Das Auto rollt langsam zurück.',
        'Die blauen Linien zeigen, wohin das Heck fährt.',
        'Halte das Lenkrad fast gerade und korrigiere nur ein wenig.',
      ],
    },
    'street-corner': {
      title: 'Abbiegen an einer Ecke',
      goal: 'Bieg rechts in die Seitenstraße ab, ohne den Bordstein zu berühren.',
      tips: [
        'Fahr ein kleines Stück über die Ecke hinaus, bevor du einlenkst.',
        'Die Hinterräder fahren weiter innen als die Vorderräder, also achte auf den inneren Bordstein.',
        'Dreh das Lenkrad zurück, sobald das Auto in der neuen Straße gerade steht.',
      ],
    },
    'pillar-turn': {
      title: 'Abbiegen an einer Säule',
      goal: 'Bieg rechts in die nächste Fahrgasse ab, ohne die Säule an der Ecke zu berühren.',
      tips: [
        'Fahr weiter, bis dein Sitz an der Säule vorbei ist, dann lenk ein.',
        'Lenkst du zu früh ein, streift die hintere Tür die Säule, auch wenn die Front schon vorbei ist.',
        'Achte auf die blauen Linien: Sie zeigen, wo die Hinterräder entlangfahren.',
      ],
    },
    'narrow-gate': {
      title: 'Durch ein enges Tor',
      goal: 'Bieg durch das Tor in den Hof ein und halte im Feld an.',
      tips: [
        'Halte dich auf der anderen Straßenseite, damit du Platz zum Einschwenken hast.',
        'Fang kurz vor dem Tor an zu lenken.',
        'Richte das Auto vor den Pfosten gerade aus und fahr dann langsam durch.',
      ],
    },
    'cone-slalom': {
      title: 'Slalom um Hütchen',
      goal: 'Fahr abwechselnd links und rechts an den Hütchen vorbei, durch jede markierte Lücke.',
      tips: [
        'Kleine, frühe Lenkbewegungen klappen besser als große, späte.',
        'Lenk schon zurück, bevor du das nächste Hütchen erreichst.',
        'Achte auf die gelbe Linie: Die vordere Ecke schwenkt weiter aus, als du denkst.',
      ],
    },
    'u-turn': {
      title: 'Wenden auf breiter Straße',
      goal: 'Wende in einem Zug und halte im Feld auf der anderen Seite an.',
      tips: [
        'Fang am rechten Straßenrand an, dann hast du den größten Bogen.',
        'Schlag das Lenkrad voll nach links ein, bevor du losrollst.',
        'Achte auf die vordere Ecke am gegenüberliegenden Bordstein.',
      ],
    },
    'reverse-corner': {
      title: 'Rückwärts um die Ecke',
      goal: 'Fahr rückwärts um die Ecke in die Seitenstraße.',
      tips: [
        'Beim Rückwärtsfahren lenkst du in die Richtung, in die das Heck fahren soll.',
        'Fang an zu lenken, wenn die Hinterräder die Ecke erreichen.',
        'Die Front schwenkt zur anderen Seite aus, also behalte sie im Blick.',
      ],
    },
    'reverse-driveway': {
      title: 'Rückwärts in die Einfahrt',
      goal: 'Fahr rückwärts zwischen den Torpfosten in die Einfahrt.',
      tips: [
        'Fahr an der Einfahrt vorbei, halte an und wähle dann R.',
        'Lenk zur Einfahrt hin, damit das Heck hineinfährt.',
        'Dreh das Lenkrad zurück, sobald das Auto gerade in der Einfahrt steht.',
      ],
    },
    'reverse-out': {
      title: 'Rückwärts ausparken',
      goal: 'Fahr rückwärts aus der Parklücke und dann die Fahrgasse entlang.',
      tips: [
        'Fahr gerade zurück, bis deine vordere Stoßstange an den Autos neben dir vorbei ist.',
        'Dann lenk so, dass das Heck in die Richtung schwenkt, aus der du gekommen bist.',
        'Die Front schwenkt zum nächsten Auto hin aus, also achte auf die gelbe Linie.',
      ],
    },
    'bay-forward': {
      title: 'Vorwärts einparken',
      goal: 'Fahr vorwärts in die freie Parklücke auf der linken Seite.',
      tips: [
        'Halte dich rechts in der Fahrgasse, dann hast du mehr Platz zum Einschwenken.',
        'Schlag voll ein, wenn deine vordere Stoßstange die nahe Linie der Lücke passiert.',
        'Die Hinterräder schneiden die Ecke, also achte auf das Auto auf der Innenseite.',
      ],
    },
    'bay-reverse': {
      title: 'Rückwärts einparken',
      goal: 'Fahr rückwärts in die freie Parklücke links, zwischen die beiden Autos.',
      tips: [
        'Fahr weiter, bis die Lücke etwa eine Autolänge hinter dir liegt.',
        'Wähle R und schlag das Lenkrad voll nach links ein, damit das Heck in die Lücke fährt.',
        'Dreh das Lenkrad zurück, wenn das Auto parallel zu den Linien steht.',
      ],
    },
    'angled-bay': {
      title: 'Schräg einparken',
      goal: 'Bieg in die freie Schrägparklücke ein.',
      tips: [
        'Für schräge Lücken reicht ein sanfter Lenkeinschlag.',
        'Fang an zu lenken, wenn dein Sitz auf Höhe der nahen Linie der Lücke ist.',
        'Dreh das Lenkrad zurück, sobald das Auto gerade in der Lücke steht.',
      ],
    },
    'parallel-park': {
      title: 'Längsparken',
      goal: 'Fahr rückwärts in die Lücke zwischen den beiden parkenden Autos, nah am Bordstein.',
      tips: [
        'Halte neben dem vorderen Auto an, sodass eure hinteren Stoßstangen auf einer Höhe sind.',
        'Fahr mit voll nach rechts eingeschlagenem Lenkrad zurück, bis das Auto etwa im 45-Grad-Winkel steht.',
        'Dann schlag voll nach links ein und fahr weiter zurück, damit die Front hineinkommt.',
      ],
    },
    'leave-parallel': {
      title: 'Aus einer Längsparklücke',
      goal: 'Fahr aus der Lücke heraus und in die Fahrspur vor dir.',
      tips: [
        'Fahr zuerst ein Stück zurück, damit du vorne Platz hast.',
        'Schlag das Lenkrad voll nach links ein, bevor du losfährst.',
        'Achte darauf, dass die gelbe Linie am vorderen Auto vorbeikommt und das Heck zum Bordstein schwenkt.',
      ],
    },
    'three-point-turn': {
      title: 'Wenden in drei Zügen',
      goal: 'Wende in der Sackgasse und halte im Feld an.',
      tips: [
        'Vorwärts mit voll nach links eingeschlagenem Lenkrad, halte vor dem Bordstein an.',
        'Rückwärts mit voll nach rechts eingeschlagenem Lenkrad, halte vor dem anderen Bordstein an.',
        'Dann wieder vorwärts. Du kannst das Lenkrad auch im Stand drehen.',
      ],
    },
    'garage-pillars': {
      title: 'Tiefgarage',
      goal: 'Fahr rückwärts in die Parklücke neben der Säule.',
      tips: [
        'Die Säulen stehen in der Lücke, also ist die Öffnung schmaler als die Linien.',
        'Fahr vor dem Zurücksetzen etwas weiter an der Lücke vorbei als sonst.',
        'Achte darauf, wie die hintere Ecke des Autos an der Säule vorbeikommt.',
      ],
    },
    'home-garage': {
      title: 'Enge Garage zu Hause',
      goal: 'Fahr in die Garage und halte vor der Rückwand an.',
      tips: [
        'Richte das Auto aus, solange du in der Einfahrt noch Platz hast.',
        'Lenk nur wenig und lass das Auto dann gerade rollen.',
        'Roll langsam hinein und halte vor der Rückwand an.',
      ],
    },
    'ramp-turn': {
      title: 'Parkhausrampe',
      goal: 'Folge der Rampe durch den Halbkreis und halte im Feld an.',
      tips: [
        'Fahr gleichmäßig und sanft und halte das Lenkrad in der Kurve ruhig.',
        'Bleib in der Mitte: Die vordere Ecke schwenkt aus und die Hinterräder schneiden innen.',
        'Dreh das Lenkrad zurück, wenn du aus der Kurve kommst.',
      ],
    },
    'crooked-neighbour': {
      title: 'Schief geparkter Nachbar',
      goal: 'Fahr rückwärts in die Lücke neben dem Auto, das über der Linie steht.',
      tips: [
        'Das Auto rechts steht über der Linie, also halte dich etwas näher am Auto links.',
        'Plane das Einlenken genauso wie bei einer normalen Parklücke.',
        'Hier zählt es: Mehr als zwei Berührungen, und du versuchst es nochmal.',
      ],
    },
  },
};
