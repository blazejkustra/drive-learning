import type { Messages } from './en.ts';

const toques = (n: number) => (n === 1 ? '1 toque' : `${n} toques`);

export const es: Messages = {
  appName: 'Práctica de conducción',
  rotateNote: 'Gira el móvil o la tableta en horizontal para conducir.',
  starsLabel: (filled: number, total: number) => `${filled} de ${total} estrellas`,

  home: {
    intro: 'Ejercicios cortos y tranquilos para espacios estrechos, aparcar y dar marcha atrás. Mira exactamente por dónde pasa cada rueda.',
    progress: (stars: number, total: number) => `${stars} de ${total} estrellas`,
    language: 'Idioma',
    wheelOnLeft: 'Volante a la izquierda',
    wheelOnRight: 'Volante a la derecha',
    start: 'Empezar',
    playAgain: 'Jugar otra vez',
    lockedNote: 'Termina el nivel anterior para desbloquear este.',
  },

  levelOf: (chapter: string, number: number) => `${chapter}, nivel ${number}`,
  levelOfTotal: (chapter: string, number: number, total: number) => `${chapter}, nivel ${number} de ${total}`,

  hud: {
    levels: 'Niveles',
    guides: 'Guías',
    trail: 'Rastro',
    wholeArea: 'Toda la zona',
    followCar: 'Seguir coche',
    slow: 'Lento',
    restart: 'Reiniciar',
    menu: 'Opciones',
    tips: 'Consejos',
    frontWheels: 'Ruedas delanteras',
    straight: 'Recto',
    steerLeft: (degrees: number) => `${degrees}° izq.`,
    steerRight: (degrees: number) => `${degrees}° der.`,
    time: 'Tiempo',
    touches: 'Toques',
    speedUnit: 'km/h',
    keyHint: 'W acelerar · S frenar · R/D/P marcha',
  },

  controls: {
    steeringWheel: 'Volante',
    gear: 'Marcha',
    park: 'Parking',
    reverse: 'Atrás',
    drive: 'Avanzar',
    gas: 'Gas',
    brake: 'Freno',
  },

  legend: {
    title: 'Líneas guía',
    rear: 'Ruedas traseras',
    front: 'Ruedas delanteras',
    swing: 'Esquina delantera',
    pivot: 'Punto de giro',
    pivotLabel: 'punto de giro',
  },

  hints: {
    chooseGear: 'Elige D para avanzar o R para ir marcha atrás.',
    holdStill: 'Quieto...',
    linedUp: 'Bien colocado. Mantén el freno para terminar.',
    almost: 'Casi. Endereza el coche según la flecha del recuadro.',
    driveGap: (number: number, total: number) => `Pasa por el hueco marcado ${number} de ${total}.`,
  },

  toasts: {
    stopFirst: 'Primero para el coche y luego cambia de marcha.',
    gapDone: (number: number, total: number) => `Hueco ${number} de ${total} superado.`,
    allGapsDone: 'Todos los huecos superados. Ahora ve al recuadro.',
  },

  bump: {
    into: {
      kerb: 'Un toque suave con el bordillo.',
      wall: 'Un toque suave con la pared.',
      hedge: 'Un toque suave con el seto.',
      building: 'Un toque suave con el edificio.',
      car: 'Un toque suave con un coche aparcado.',
      cone: 'Un toque suave con un cono.',
      pillar: 'Un toque suave con una columna.',
      post: 'Un toque suave con un poste de la entrada.',
      planter: 'Un toque suave con un árbol.',
      edge: 'Un toque suave con el borde de la zona de práctica.',
    },
    allowed: (touches: number, limit: number) => `Llevas ${touches} de ${limit} ${limit === 1 ? 'toque permitido' : 'toques permitidos'}.`,
    backOff: 'Retrocede un poco y vuelve a intentarlo.',
    insideRear: 'La parte trasera se ha metido por dentro de la esquina. Las ruedas traseras hacen una curva más cerrada que las delanteras, así que avanza un poco más antes de girar.',
    frontSwing: 'La esquina delantera se ha abierto demasiado. Al girar, el morro del coche se sale por fuera de las ruedas, así que deja más espacio por fuera.',
    frontSwingReverse: 'El morro se ha abierto mientras ibas marcha atrás. Al girar marcha atrás, la parte delantera se mueve hacia el otro lado, así que vigila ese lado.',
  },

  intro: {
    allowedTouches: (limit: number) => `Toques permitidos: ${limit}.`,
    startDriving: 'Empezar a conducir',
    howTurningWorks: 'Cómo se gira',
  },

  result: {
    perfect: 'Perfecto',
    nicelyDone: 'Muy bien',
    madeIt: 'Lo has conseguido',
    time: 'Tiempo',
    touches: 'Toques',
    position: 'Posición',
    aimFor: (time: string) => `objetivo: ${time}`,
    noTouches: 'Sin toques',
    touchCount: (touches: number) => toques(touches),
    great: 'Perfectamente colocado',
    good: 'Bien colocado',
    crooked: 'Un poco torcido',
    tryAgain: 'Reintentar',
    allLevels: 'Todos los niveles',
    nextLevel: 'Siguiente nivel',
    failTitle: 'Vamos a intentarlo otra vez',
    failBody: 'Ha sido un toque de más para esta plaza. Ve más despacio y apóyate en las líneas guía.',
  },

  lesson: {
    title: 'Cómo se gira',
    steps: {
      paths: 'Al girar a la derecha, las ruedas traseras (azul) van por dentro de las delanteras (blanco) y la esquina delantera (amarillo) se abre hacia fuera.',
      pillarHit: 'Si giras demasiado pronto junto a una columna, el morro pasa, pero la puerta trasera choca con ella.',
      pillarClear: 'Avanza un poco más antes de girar y la parte trasera también pasará la columna.',
      reverse: 'Al girar marcha atrás, la parte trasera va hacia donde giras el volante y el morro se abre hacia el otro lado.',
    },
    stepOf: (number: number, total: number) => `${number} de ${total}`,
    replay: 'Repetir',
    back: 'Atrás',
    next: 'Siguiente',
    done: 'Entendido',
  },

  chapters: {
    basics: {
      title: 'Conoce el coche',
      summary: 'Acelerador, freno, volante y marcha atrás en un espacio vacío.',
    },
    turning: {
      title: 'Girar',
      summary: 'Esquinas, entradas y curvas cerradas. Fíjate en cómo se meten las ruedas traseras.',
    },
    reversing: {
      title: 'Marcha atrás',
      summary: 'Esquinas y huecos estrechos dando marcha atrás.',
    },
    parking: {
      title: 'Aparcar',
      summary: 'Plazas de supermercado, plazas en diagonal y aparcar en línea en la calle.',
    },
    'tight-spots': {
      title: 'Sitios estrechos del día a día',
      summary: 'Calles sin salida, garajes, rampas y vecinos que aparcan mal.',
    },
  },

  levels: {
    'stop-on-the-line': {
      title: 'Avanzar y parar',
      goal: 'Avanza y para con todo el coche dentro del recuadro verde.',
      tips: [
        'Toca D para elegir Avanzar.',
        'Si sueltas el acelerador, el coche sigue avanzando despacio, igual que un automático de verdad.',
        'Mantén el freno para parar dentro del recuadro.',
      ],
    },
    'gentle-curve': {
      title: 'Una curva suave',
      goal: 'Sigue la carretera por la curva y para en el recuadro.',
      tips: [
        'Gira un poco el volante y mantenlo así. El coche sigue una curva constante.',
        'Las líneas azules muestran por dónde irán las ruedas traseras.',
        'Endereza el volante cuando la carretera se enderece.',
      ],
    },
    'full-circle': {
      title: 'Círculo con el volante a tope',
      goal: 'Da una vuelta completa a la isleta y para otra vez en el recuadro.',
      tips: [
        'Gira el volante a tope hacia la izquierda y mantenlo así.',
        'La línea amarilla muestra cómo la esquina delantera se abre por fuera.',
        'Las ruedas traseras dibujan un círculo más pequeño que las delanteras.',
      ],
    },
    'reverse-straight': {
      title: 'Marcha atrás a un recuadro',
      goal: 'Entra marcha atrás en el recuadro pintado y para.',
      tips: [
        'Toca R para Atrás. El coche retrocede despacio.',
        'Las líneas azules muestran hacia dónde va la parte trasera.',
        'Mantén el volante casi recto y haz pequeñas correcciones.',
      ],
    },
    'street-corner': {
      title: 'Girar en una esquina',
      goal: 'Gira a la derecha hacia la calle lateral sin tocar el bordillo.',
      tips: [
        'Avanza un poco más allá de la esquina antes de girar.',
        'Las ruedas traseras van por dentro de las delanteras, así que vigila el bordillo interior.',
        'Endereza el volante cuando el coche quede alineado con la nueva calle.',
      ],
    },
    'pillar-turn': {
      title: 'Girar junto a una columna',
      goal: 'Gira a la derecha hacia el siguiente pasillo sin tocar la columna de la esquina.',
      tips: [
        'Sigue avanzando hasta que tu asiento pase la columna y entonces gira.',
        'Si giras demasiado pronto, la puerta trasera roza la columna, aunque el morro ya haya pasado.',
        'Fíjate en las líneas azules: muestran por dónde irán las ruedas traseras.',
      ],
    },
    'narrow-gate': {
      title: 'Por una entrada estrecha',
      goal: 'Gira por la entrada hacia el patio y para en el recuadro.',
      tips: [
        'Pégate al lado contrario de la calle para tener espacio al girar.',
        'Empieza a girar un poco antes de llegar a la entrada.',
        'Ponte recto antes de los postes y pasa despacio.',
      ],
    },
    'cone-slalom': {
      title: 'Eslalon entre conos',
      goal: 'Ve en zigzag a izquierda y derecha de los conos por cada hueco marcado.',
      tips: [
        'Giros pequeños y a tiempo funcionan mejor que giros grandes y tarde.',
        'Empieza a girar de vuelta antes de llegar a cada cono.',
        'Fíjate en la línea amarilla: la esquina delantera se abre más de lo que esperas.',
      ],
    },
    'u-turn': {
      title: 'Cambio de sentido en una calle ancha',
      goal: 'Da la vuelta de una sola vez y para en el recuadro del otro lado.',
      tips: [
        'Empieza desde el lado derecho de la calle para tener el giro más amplio.',
        'Gira el volante a tope a la izquierda antes de empezar a moverte.',
        'Vigila la esquina delantera cerca del bordillo de enfrente.',
      ],
    },
    'reverse-corner': {
      title: 'Marcha atrás en una esquina',
      goal: 'Gira marcha atrás por la esquina hacia la calle lateral.',
      tips: [
        'Marcha atrás, gira el volante hacia donde quieres que vaya la parte trasera.',
        'Empieza a girar cuando las ruedas traseras lleguen a la esquina.',
        'El morro se abre hacia el otro lado, así que no lo pierdas de vista.',
      ],
    },
    'reverse-driveway': {
      title: 'Marcha atrás a una entrada',
      goal: 'Entra marcha atrás en la entrada de la casa, entre los postes.',
      tips: [
        'Pasa de largo la entrada, para y elige R.',
        'Gira el volante hacia la entrada para meter la parte trasera.',
        'Endereza cuando el coche apunte a lo largo de la entrada.',
      ],
    },
    'reverse-out': {
      title: 'Salir marcha atrás de una plaza',
      goal: 'Sal marcha atrás de la plaza de aparcamiento y sigue por el carril.',
      tips: [
        'Retrocede recto hasta que el parachoques delantero haya pasado los coches de los lados.',
        'Luego gira para que la parte trasera vaya hacia donde has venido.',
        'El morro se abre hacia el coche de al lado, así que vigila la línea amarilla.',
      ],
    },
    'bay-forward': {
      title: 'Aparcar en batería de frente',
      goal: 'Entra de frente en la plaza libre de la izquierda.',
      tips: [
        'Pégate al lado derecho del carril para tener un giro más amplio.',
        'Gira a tope cuando el parachoques delantero pase la primera línea de la plaza.',
        'Las ruedas traseras recortan la esquina, así que vigila el coche del lado de dentro.',
      ],
    },
    'bay-reverse': {
      title: 'Aparcar en batería marcha atrás',
      goal: 'Entra marcha atrás en la plaza libre de la izquierda, entre los dos coches.',
      tips: [
        'Sigue hasta que la plaza quede más o menos un coche por detrás de ti.',
        'Elige R y gira el volante a tope a la izquierda para meter la parte trasera en la plaza.',
        'Endereza el volante cuando el coche esté paralelo a las líneas.',
      ],
    },
    'angled-bay': {
      title: 'Aparcar en diagonal',
      goal: 'Entra en la plaza en diagonal que está libre.',
      tips: [
        'Las plazas en diagonal solo necesitan un giro suave.',
        'Empieza a girar cuando tu asiento esté a la altura de la primera línea de la plaza.',
        'Endereza el volante cuando el coche quede alineado con la plaza.',
      ],
    },
    'parallel-park': {
      title: 'Aparcar en línea',
      goal: 'Entra marcha atrás en el hueco entre los dos coches aparcados, cerca del bordillo.',
      tips: [
        'Para junto al coche de delante con los parachoques traseros a la misma altura.',
        'Retrocede con el volante a tope a la derecha hasta que el coche quede a unos 45 grados.',
        'Luego gira a tope a la izquierda y sigue marcha atrás para meter el morro.',
      ],
    },
    'leave-parallel': {
      title: 'Salir de un aparcamiento en línea',
      goal: 'Sal del hueco y entra en el carril de delante.',
      tips: [
        'Primero retrocede un poco para tener espacio delante.',
        'Gira el volante a tope a la izquierda antes de avanzar.',
        'Fíjate en que la línea amarilla libre el coche de delante y en cómo la parte trasera se acerca al bordillo.',
      ],
    },
    'three-point-turn': {
      title: 'Cambio de sentido en tres maniobras',
      goal: 'Da la vuelta en la calle sin salida y para en el recuadro.',
      tips: [
        'Hacia delante con el volante a tope a la izquierda, para antes del bordillo.',
        'Marcha atrás con el volante a tope a la derecha, para antes del otro bordillo.',
        'Y otra vez hacia delante. Puedes girar el volante con el coche parado.',
      ],
    },
    'garage-pillars': {
      title: 'Garaje subterráneo',
      goal: 'Entra marcha atrás en la plaza junto a la columna.',
      tips: [
        'Las columnas están dentro de la plaza, así que el hueco es más estrecho que las líneas.',
        'Pasa la plaza un poco más de lo normal antes de dar marcha atrás.',
        'Vigila cómo la esquina trasera del coche pasa la columna.',
      ],
    },
    'home-garage': {
      title: 'Garaje de casa estrecho',
      goal: 'Entra en el garaje y para antes de la pared del fondo.',
      tips: [
        'Coloca bien el coche mientras aún tienes espacio en la entrada.',
        'Haz movimientos pequeños con el volante y luego deja que el coche vaya recto.',
        'Entra muy despacio y para antes de la pared del fondo.',
      ],
    },
    'ramp-turn': {
      title: 'Rampa de parking',
      goal: 'Sigue la rampa por la media vuelta y para en el recuadro.',
      tips: [
        'Ve a una velocidad suave y constante y mantén el volante quieto en la curva.',
        'Quédate en el centro: la esquina delantera se abre y las ruedas traseras se meten.',
        'Endereza el volante al salir de la curva.',
      ],
    },
    'crooked-neighbour': {
      title: 'Vecino mal aparcado',
      goal: 'Entra marcha atrás en la plaza junto al coche que pisa la línea.',
      tips: [
        'El coche de tu derecha pisa la línea, así que arrímate un poco más al de tu izquierda.',
        'Planea el giro igual que en una plaza normal.',
        'Este cuenta: con más de dos toques, vuelves a intentarlo.',
      ],
    },
  },
};
