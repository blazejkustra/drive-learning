import type { ObstacleKind } from '../level-types.ts';
import type { Messages } from './en.ts';

function touchWord(count: number) {
  if (count === 1) return 'dotknięcie';
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'dotknięcia';
  return 'dotknięć';
}

export const pl: Messages = {
  appName: 'Trening jazdy',
  rotateNote: 'Obróć iPada poziomo, żeby jeździć.',
  starsLabel: (filled: number, total: number) => `${filled} z ${total} gwiazdek`,

  home: {
    intro: 'Krótkie, spokojne ćwiczenia z ciasnych miejsc, parkowania i cofania. Widzisz dokładnie, którędy jedzie każde koło.',
    progress: (stars: number, total: number) => `${stars} z ${total} gwiazdek`,
    language: 'Język',
    wheelOnLeft: 'Kierownica po lewej',
    wheelOnRight: 'Kierownica po prawej',
    start: 'Start',
    playAgain: 'Jedź jeszcze raz',
    lockedNote: 'Ukończ poprzedni poziom, żeby odblokować ten.',
  },

  levelOf: (chapter: string, number: number) => `${chapter}, poziom ${number}`,
  levelOfTotal: (chapter: string, number: number, total: number) => `${chapter}, poziom ${number} z ${total}`,

  hud: {
    levels: 'Poziomy',
    guides: 'Linie',
    trail: 'Ślad',
    wholeArea: 'Cały plac',
    followCar: 'Śledź auto',
    slow: 'Wolno',
    restart: 'Od nowa',
    nextTip: 'Kolejna rada',
    frontWheels: 'Przednie koła',
    straight: 'Prosto',
    steerLeft: (degrees: number) => `${degrees}° w lewo`,
    steerRight: (degrees: number) => `${degrees}° w prawo`,
    time: 'Czas',
    touches: 'Dotknięcia',
    speedUnit: 'km/h',
    keyHint: 'W gaz · S hamulec · R/D/P bieg',
  },

  controls: {
    steeringWheel: 'Kierownica',
    gear: 'Bieg',
    park: 'Parking',
    reverse: 'Wsteczny',
    drive: 'Jazda',
    gas: 'Gaz',
    brake: 'Hamulec',
  },

  legend: {
    title: 'Linie pomocnicze',
    rear: 'Tylne koła',
    front: 'Przednie koła',
    swing: 'Przedni narożnik',
    pivot: 'Punkt obrotu',
    pivotLabel: 'punkt obrotu',
  },

  hints: {
    chooseGear: 'Wybierz D, żeby jechać do przodu, albo R, żeby cofać.',
    holdStill: 'Stój spokojnie...',
    linedUp: 'Ustawione. Przytrzymaj hamulec, żeby zakończyć.',
    almost: 'Prawie. Wyprostuj auto zgodnie ze strzałką w polu.',
    driveGap: (number: number, total: number) => `Przejedź przez oznaczoną bramkę ${number} z ${total}.`,
  },

  toasts: {
    stopFirst: 'Najpierw zatrzymaj auto, potem zmień bieg.',
    gapDone: (number: number, total: number) => `Bramka ${number} z ${total} zaliczona.`,
    allGapsDone: 'Wszystkie bramki zaliczone. Teraz jedź do pola.',
  },

  bump: {
    into: {
      kerb: 'Lekkie stuknięcie w krawężnik.',
      wall: 'Lekkie stuknięcie w ścianę.',
      hedge: 'Lekkie stuknięcie w żywopłot.',
      building: 'Lekkie stuknięcie w budynek.',
      car: 'Lekkie stuknięcie w zaparkowane auto.',
      cone: 'Lekkie stuknięcie w pachołek.',
      pillar: 'Lekkie stuknięcie w filar.',
      post: 'Lekkie stuknięcie w słupek bramy.',
      planter: 'Lekkie stuknięcie w drzewo.',
      edge: 'Lekkie stuknięcie w krawędź placu manewrowego.',
    } satisfies Record<ObstacleKind, string>,
    allowed: (touches: number, limit: number) => `To dotknięcie ${touches} z ${limit} dozwolonych.`,
    backOff: 'Odsuń się trochę i spróbuj jeszcze raz.',
    insideRear: 'Tył auta ściął zakręt. Tylne koła jadą ciaśniejszym torem niż przednie, więc podjedź trochę dalej, zanim skręcisz.',
    frontSwing: 'Przedni narożnik wyjechał szeroko na zewnątrz. Gdy skręcasz, przód auta wychyla się poza koła, więc zostaw więcej miejsca po zewnętrznej.',
    frontSwingReverse: 'Przód wychylił się podczas cofania. Gdy cofasz i skręcasz, przód idzie w przeciwną stronę, więc pilnuj tej strony.',
  },

  intro: {
    allowedTouches: (limit: number) => `Dozwolone dotknięcia: ${limit}.`,
    startDriving: 'Ruszamy',
    howTurningWorks: 'Jak skręca auto',
  },

  result: {
    perfect: 'Perfekcyjnie',
    nicelyDone: 'Dobra robota',
    madeIt: 'Udało się',
    time: 'Czas',
    touches: 'Dotknięcia',
    position: 'Ustawienie',
    aimFor: (time: string) => `cel: ${time}`,
    noTouches: 'Bez dotknięć',
    touchCount: (touches: number) => `${touches} ${touchWord(touches)}`,
    great: 'Równo ustawione',
    good: 'Ustawione',
    crooked: 'Trochę krzywo',
    tryAgain: 'Spróbuj ponownie',
    allLevels: 'Wszystkie poziomy',
    nextLevel: 'Następny poziom',
    failTitle: 'Spróbujmy jeszcze raz',
    failBody: 'To o jedno dotknięcie za dużo jak na to miejsce. Jedź wolniej i korzystaj z linii pomocniczych.',
  },

  lesson: {
    title: 'Jak skręca auto',
    steps: {
      paths: 'Gdy skręcasz w prawo, tylne koła (niebieskie) jadą bardziej do środka niż przednie (białe), a przedni narożnik (żółty) wychyla się szeroko na zewnątrz.',
      pillarHit: 'Jeśli przy filarze skręcisz za wcześnie, przód się zmieści, ale tylne drzwi w niego uderzą.',
      pillarClear: 'Podjedź dalej do przodu, zanim skręcisz, a tył auta też minie filar.',
      reverse: 'Gdy cofasz i skręcasz, tył jedzie tam, gdzie kręcisz kierownicą, a przód wychyla się w przeciwną stronę.',
    },
    stepOf: (number: number, total: number) => `${number} z ${total}`,
    replay: 'Powtórz',
    back: 'Wstecz',
    next: 'Dalej',
    done: 'Rozumiem',
  },

  chapters: {
    basics: {
      title: 'Poznaj auto',
      summary: 'Gaz, hamulec, kierownica i bieg wsteczny na pustym placu.',
    },
    turning: {
      title: 'Skręcanie',
      summary: 'Zakręty, bramy i ciasne łuki. Zobacz, jak tylne koła ścinają do środka.',
    },
    reversing: {
      title: 'Cofanie',
      summary: 'Cofanie za róg i w wąskie wjazdy.',
    },
    parking: {
      title: 'Parkowanie',
      summary: 'Miejsca pod marketem, parkowanie skośne i równoległe przy ulicy.',
    },
    'tight-spots': {
      title: 'Ciasne miejsca na co dzień',
      summary: 'Ślepe uliczki, garaże, rampy i kłopotliwi sąsiedzi.',
    },
  },

  levels: {
    'stop-on-the-line': {
      title: 'Jedź i zatrzymaj się',
      goal: 'Jedź do przodu i zatrzymaj się tak, żeby całe auto stało w zielonym polu.',
      tips: [
        'Dotknij D, żeby wybrać Jazdę.',
        'Gdy puścisz gaz, auto dalej powoli się toczy, tak jak prawdziwy automat.',
        'Przytrzymaj hamulec, żeby zatrzymać się w polu.',
      ],
    },
    'gentle-curve': {
      title: 'Łagodny łuk',
      goal: 'Jedź drogą przez zakręt i zatrzymaj się w polu.',
      tips: [
        'Skręć lekko kierownicę i trzymaj ją w tej pozycji. Auto pojedzie równym łukiem.',
        'Niebieskie linie pokazują, którędy pojadą tylne koła.',
        'Prostuj kierownicę, gdy droga się prostuje.',
      ],
    },
    'full-circle': {
      title: 'Koło z kierownicą do oporu',
      goal: 'Objedź wysepkę dookoła i zatrzymaj się z powrotem w polu.',
      tips: [
        'Skręć kierownicę do oporu w lewo i trzymaj ją tak.',
        'Żółta linia pokazuje, jak przedni narożnik wychyla się szeroko na zewnątrz.',
        'Tylne koła zataczają mniejsze koło niż przednie.',
      ],
    },
    'reverse-straight': {
      title: 'Cofanie do pola',
      goal: 'Cofnij do namalowanego pola i zatrzymaj się.',
      tips: [
        'Dotknij R, żeby wrzucić wsteczny. Auto powoli toczy się do tyłu.',
        'Niebieskie linie pokazują, dokąd jedzie tył auta.',
        'Trzymaj kierownicę prawie prosto i poprawiaj tylko odrobinę.',
      ],
    },
    'street-corner': {
      title: 'Skręt na skrzyżowaniu',
      goal: 'Skręć w prawo w boczną ulicę, nie dotykając krawężnika.',
      tips: [
        'Podjedź trochę za róg, zanim zaczniesz skręcać.',
        'Tylne koła ścinają do środka bardziej niż przednie, więc uważaj na wewnętrzny krawężnik.',
        'Prostuj kierownicę, gdy auto ustawia się wzdłuż nowej ulicy.',
      ],
    },
    'pillar-turn': {
      title: 'Skręt obok filaru',
      goal: 'Skręć w prawo w następną alejkę, nie dotykając filaru na rogu.',
      tips: [
        'Jedź dalej, aż twój fotel minie filar, i dopiero wtedy skręcaj.',
        'Jeśli skręcisz za wcześnie, tylne drzwi zahaczą o filar, nawet gdy przód już przejechał.',
        'Patrz na niebieskie linie: pokazują, którędy pojadą tylne koła.',
      ],
    },
    'narrow-gate': {
      title: 'Przez wąską bramę',
      goal: 'Skręć przez bramę na podwórko i zatrzymaj się w polu.',
      tips: [
        'Trzymaj się drugiej strony drogi, żeby mieć miejsce na wjazd.',
        'Zacznij skręcać trochę przed bramą.',
        'Ustaw auto prosto przed słupkami, a potem przejedź powoli.',
      ],
    },
    'cone-slalom': {
      title: 'Slalom między pachołkami',
      goal: 'Omijaj pachołki raz z lewej, raz z prawej, przez każdą oznaczoną bramkę.',
      tips: [
        'Małe, wczesne ruchy kierownicą działają lepiej niż duże i spóźnione.',
        'Zacznij odkręcać, zanim dojedziesz do pachołka.',
        'Patrz na żółtą linię: przedni narożnik wychyla się szerzej, niż się wydaje.',
      ],
    },
    'u-turn': {
      title: 'Zawracanie na szerokiej ulicy',
      goal: 'Zawróć za jednym razem i zatrzymaj się w polu po drugiej stronie.',
      tips: [
        'Zacznij od prawej strony drogi, żeby mieć jak najszerszy łuk.',
        'Skręć kierownicę do oporu w lewo, zanim ruszysz.',
        'Uważaj na przedni narożnik przy dalszym krawężniku.',
      ],
    },
    'reverse-corner': {
      title: 'Cofanie za róg',
      goal: 'Cofnij za róg w boczną ulicę.',
      tips: [
        'Przy cofaniu kręć kierownicą w tę stronę, w którą ma pojechać tył auta.',
        'Zacznij skręcać, gdy tylne koła dojadą do rogu.',
        'Przód auta wychyla się w przeciwną stronę, więc miej go na oku.',
      ],
    },
    'reverse-driveway': {
      title: 'Cofanie na podjazd',
      goal: 'Wjedź tyłem na podjazd między słupkami bramy.',
      tips: [
        'Miń podjazd, zatrzymaj się i wybierz R.',
        'Skręć kierownicę w stronę podjazdu, żeby tył auta w niego wjechał.',
        'Wyprostuj kierownicę, gdy auto ustawi się wzdłuż podjazdu.',
      ],
    },
    'reverse-out': {
      title: 'Wyjazd tyłem z miejsca',
      goal: 'Wyjedź tyłem z miejsca parkingowego i odjedź alejką.',
      tips: [
        'Cofaj prosto, aż przedni zderzak minie auta obok ciebie.',
        'Potem skręć tak, żeby tył auta poszedł w stronę, z której auto przyjechało.',
        'Przód wychyla się w stronę sąsiedniego auta, więc patrz na żółtą linię.',
      ],
    },
    'bay-forward': {
      title: 'Parkowanie przodem',
      goal: 'Wjedź przodem na wolne miejsce po lewej.',
      tips: [
        'Trzymaj się prawej strony alejki, żeby mieć szerszy łuk.',
        'Skręć do oporu, gdy przedni zderzak minie bliższą linię miejsca.',
        'Tylne koła ścinają róg, więc uważaj na auto po wewnętrznej.',
      ],
    },
    'bay-reverse': {
      title: 'Parkowanie tyłem',
      goal: 'Wjedź tyłem na wolne miejsce po lewej, między dwa auta.',
      tips: [
        'Jedź dalej, aż miejsce będzie około jednej długości auta za tobą.',
        'Wybierz R i skręć kierownicę do oporu w lewo, żeby tył wjechał na miejsce.',
        'Wyprostuj kierownicę, gdy auto stanie równolegle do linii.',
      ],
    },
    'angled-bay': {
      title: 'Parkowanie skośne',
      goal: 'Wjedź na wolne skośne miejsce.',
      tips: [
        'Na skośne miejsce wystarczy łagodny skręt.',
        'Zacznij skręcać, gdy twój fotel zrówna się z bliższą linią miejsca.',
        'Prostuj kierownicę, gdy auto ustawia się w miejscu.',
      ],
    },
    'parallel-park': {
      title: 'Parkowanie równoległe',
      goal: 'Wjedź tyłem w lukę między dwoma zaparkowanymi autami, blisko krawężnika.',
      tips: [
        'Zatrzymaj się obok przedniego auta tak, żeby wasze tylne zderzaki były na równi.',
        'Cofaj z kierownicą do oporu w prawo, aż auto ustawi się pod kątem około 45 stopni.',
        'Potem skręć do oporu w lewo i cofaj dalej, żeby wprowadzić przód.',
      ],
    },
    'leave-parallel': {
      title: 'Wyjazd z miejsca równoległego',
      goal: 'Wyjedź z miejsca na pas przed tobą.',
      tips: [
        'Najpierw cofnij trochę, żeby mieć miejsce z przodu.',
        'Skręć kierownicę do oporu w lewo, zanim ruszysz do przodu.',
        'Patrz, czy żółta linia mija auto z przodu, a tył odchodzi w stronę krawężnika.',
      ],
    },
    'three-point-turn': {
      title: 'Zawracanie na trzy razy',
      goal: 'Zawróć w ślepej uliczce i zatrzymaj się w polu.',
      tips: [
        'Do przodu z kierownicą do oporu w lewo, zatrzymaj się przed krawężnikiem.',
        'Do tyłu z kierownicą do oporu w prawo, zatrzymaj się przed drugim krawężnikiem.',
        'Potem znowu do przodu. Kierownicą możesz kręcić, gdy auto stoi.',
      ],
    },
    'garage-pillars': {
      title: 'Garaż podziemny',
      goal: 'Wjedź tyłem na miejsce obok filaru.',
      tips: [
        'Filary stoją w obrębie miejsca, więc wjazd jest węższy, niż pokazują linie.',
        'Przed cofaniem przejedź trochę dalej za miejsce niż zwykle.',
        'Patrz, jak tylny narożnik auta mija filar.',
      ],
    },
    'home-garage': {
      title: 'Wąski garaż przy domu',
      goal: 'Wjedź do garażu i zatrzymaj się przed tylną ścianą.',
      tips: [
        'Ustaw auto prosto, póki masz jeszcze miejsce na podjeździe.',
        'Rób małe ruchy kierownicą, a potem pozwól autu jechać prosto.',
        'Wjeżdżaj powoli i zatrzymaj się przed tylną ścianą.',
      ],
    },
    'ramp-turn': {
      title: 'Rampa w parkingu',
      goal: 'Jedź rampą po półkolu i zatrzymaj się w polu.',
      tips: [
        'Jedź równo i spokojnie, a na łuku trzymaj kierownicę nieruchomo.',
        'Trzymaj się środka: przedni narożnik wychyla się na zewnątrz, a tylne koła ścinają do środka.',
        'Prostuj kierownicę, gdy wyjeżdżasz z łuku.',
      ],
    },
    'crooked-neighbour': {
      title: 'Krzywo zaparkowany sąsiad',
      goal: 'Wjedź tyłem na miejsce obok auta, które stoi na linii.',
      tips: [
        'Auto po prawej stoi na linii, więc trzymaj się trochę bliżej auta po lewej.',
        'Zaplanuj skręt tak samo jak przy zwykłym miejscu.',
        'Tu to się liczy: więcej niż dwa dotknięcia i próbujesz od nowa.',
      ],
    },
  },
};
