import type { LevelId } from './i18n/en.ts';
import type { Chapter, Checkpoint, GroundKind, Level, MapData, StartPose, TargetZone } from './level-types.ts';
import { MapBuilder, evenly } from './map-builder.ts';

interface LevelSpec {
  id: LevelId;
  bounds: Level['bounds'];
  ground?: GroundKind;
  draw: (m: MapBuilder) => void;
  start: StartPose;
  target: TargetZone;
  checkpoints?: Checkpoint[];
  guides?: boolean;
  parTime: number;
  maxTouches?: number;
}

function addEdges(map: MapData, bounds: Level['bounds']): void {
  const { x, y, w, h } = bounds;
  const t = 2;
  const edges = [
    { cx: x + w / 2, cy: y - t / 2, halfLength: w / 2 + t, halfWidth: t / 2 },
    { cx: x + w / 2, cy: y + h + t / 2, halfLength: w / 2 + t, halfWidth: t / 2 },
    { cx: x - t / 2, cy: y + h / 2, halfLength: t / 2, halfWidth: h / 2 + t },
    { cx: x + w + t / 2, cy: y + h / 2, halfLength: t / 2, halfWidth: h / 2 + t },
  ];
  for (const edge of edges) map.obstacles.push({ shape: 'box', kind: 'edge', box: { ...edge, angle: 0 } });
}

function defineLevel(spec: LevelSpec): Level {
  const builder = new MapBuilder(spec.ground);
  spec.draw(builder);
  const map = builder.build();
  addEdges(map, spec.bounds);
  return {
    id: spec.id,
    bounds: spec.bounds,
    map,
    start: spec.start,
    target: spec.target,
    checkpoints: spec.checkpoints ?? [],
    guides: spec.guides ?? true,
    parTime: spec.parTime,
    maxTouches: spec.maxTouches,
  };
}

function trees(m: MapBuilder, points: [number, number][]): void {
  for (const [x, y] of points) m.planter(x, y, 1.1);
}

/** Car park with perpendicular bays on both sides of a north-south lane; empty bays by index from the top. */
function bayLot(m: MapBuilder, emptyWest: number[], emptyEast: number[]): void {
  const lines = evenly(2.55, 2.7, 12);
  const centres = lines.slice(0, -1).map((y) => y + 1.35);
  m.asphalt(4, 0, 17, 36);
  m.kerb(3.7, 0, 0.3, 36).kerb(21, 0, 0.3, 36);
  m.bayDividers(4, 9, lines).bayDividers(16, 21, lines);
  m.line(4.1, lines[0], 4.1, lines[lines.length - 1]).line(20.9, lines[0], 20.9, lines[lines.length - 1]);
  centres.forEach((y, i) => {
    if (!emptyWest.includes(i)) m.car(6.6, y, i % 3 === 0 ? 0 : 180);
    if (!emptyEast.includes(i)) m.car(18.4, y, i % 2 === 0 ? 180 : 0);
  });
  m.arrow(12.5, 33, -90).arrow(12.5, 22, -90).arrow(12.5, 6, -90);
  trees(m, [[1.6, 6], [1.6, 18], [1.6, 30], [23, 12], [23, 26]]);
}

function parallelStreet(m: MapBuilder): void {
  m.asphalt(4, 0, 12, 34);
  m.kerb(3.7, 0, 0.3, 34).kerb(16, 0, 0.3, 34);
  m.surface('pavement', 16.3, 0, 3.2, 34).surface('pavement', 0.8, 0, 2.9, 34);
  m.dashed(10, 0, 10, 34);
  m.building(19.5, 1, 3, 14).building(19.5, 17, 3, 16);
}

const basics: Chapter = {
  id: 'basics',
  levels: [
    defineLevel({
      id: 'stop-on-the-line',
      bounds: { x: 0, y: 0, w: 24, h: 36 },
      draw: (m) => {
        m.asphalt(8, 0, 8, 36).kerb(7.7, 0, 0.3, 36).kerb(16, 0, 0.3, 36);
        m.surface('pavement', 5, 0, 2.7, 36).surface('pavement', 16.3, 0, 2.7, 36);
        m.line(8.4, 0, 8.4, 36).line(15.6, 0, 15.6, 36);
        m.wall(8, 0, 8, 0.5);
        trees(m, [[2.5, 6], [2.5, 20], [21.5, 12], [21.5, 28]]);
      },
      start: { x: 12, y: 31, heading: -90 },
      target: { x: 12, y: 9, heading: -90, length: 5.4, width: 2.6, headingTolerance: 12 },
      parTime: 30,
    }),
    defineLevel({
      id: 'gentle-curve',
      bounds: { x: 0, y: 0, w: 36, h: 36 },
      draw: (m) => {
        m.asphalt(6, 20, 8, 16).ring('asphalt', 24, 20, 10, 18, 180, 270).asphalt(24, 2, 12, 8);
        m.kerb(5.7, 20, 0.3, 16).kerb(14, 20, 0.3, 16);
        m.arc('kerb', 24, 20, 9.7, 10, 180, 270).arc('kerb', 24, 20, 18, 18.3, 180, 270);
        m.kerb(24, 1.7, 12, 0.3).kerb(24, 10, 12, 0.3);
        m.line(6.4, 20, 6.4, 36).line(13.6, 20, 13.6, 36);
        m.arcLine(24, 20, 10.4, 180, 270).arcLine(24, 20, 17.6, 180, 270);
        m.line(24, 2.4, 36, 2.4).line(24, 9.6, 36, 9.6);
        m.wall(35.5, 2, 0.5, 8);
        trees(m, [[27, 14], [31, 16.5], [3, 30], [3, 10], [31, 28]]);
      },
      start: { x: 10, y: 32, heading: -90 },
      target: { x: 30, y: 6, heading: 0, length: 5.6, width: 3, headingTolerance: 12 },
      parTime: 40,
    }),
    defineLevel({
      id: 'full-circle',
      bounds: { x: 4, y: 5, w: 24, h: 24 },
      draw: (m) => {
        m.asphalt(5, 6, 22, 22);
        m.kerb(4.7, 5.7, 22.6, 0.3).kerb(4.7, 28, 22.6, 0.3).kerb(4.7, 6, 0.3, 22).kerb(27, 6, 0.3, 22);
        m.planter(16, 17, 1.6);
        for (let i = 0; i < 14; i++) {
          const angle = (i / 14) * Math.PI * 2;
          m.cone(16 + Math.cos(angle) * 9, 17 + Math.sin(angle) * 9);
        }
      },
      start: { x: 19.8, y: 15.65, heading: -90 },
      target: { x: 19.8, y: 15.65, heading: -90, length: 5.6, width: 3.6, headingTolerance: 20 },
      checkpoints: [
        { x: 16, y: 13, r: 2.2 },
        { x: 12, y: 17, r: 2.2 },
        { x: 16, y: 21, r: 2.2 },
      ],
      parTime: 45,
    }),
    defineLevel({
      id: 'reverse-straight',
      bounds: { x: 0, y: 0, w: 24, h: 36 },
      draw: (m) => {
        m.asphalt(4, 2, 16, 32);
        m.kerb(3.7, 1.7, 16.6, 0.3).kerb(3.7, 34, 16.6, 0.3).kerb(3.7, 2, 0.3, 32).kerb(20, 2, 0.3, 32);
        m.line(10.65, 24.3, 10.65, 29.7).line(13.35, 24.3, 13.35, 29.7).line(10.65, 29.7, 13.35, 29.7);
        for (const y of [14, 18, 22, 26, 30]) m.cone(8.2, y).cone(15.8, y);
        trees(m, [[1.8, 10], [1.8, 26], [22.2, 18]]);
      },
      start: { x: 12.4, y: 11, heading: -87 },
      target: { x: 12, y: 27, heading: -90, length: 5.4, width: 2.7, headingTolerance: 10 },
      parTime: 40,
    }),
  ],
};

const turning: Chapter = {
  id: 'turning',
  lesson: 'turning',
  levels: [
    defineLevel({
      id: 'street-corner',
      bounds: { x: 0, y: 0, w: 34, h: 40 },
      draw: (m) => {
        m.asphalt(5, 0, 9, 40).asphalt(14, 9, 20, 9);
        m.kerb(0, 0, 5, 40).kerb(14, 0, 20, 9).kerb(14, 18, 20, 22);
        m.building(0, 0, 2.4, 40).building(16, 0, 16, 6.5).building(16, 20.5, 16, 17);
        m.dashed(9.5, 18, 9.5, 40).dashed(9.5, 0, 9.5, 9).dashed(14, 13.5, 34, 13.5);
      },
      start: { x: 11.75, y: 35, heading: -90 },
      target: { x: 28, y: 15.75, heading: 0, length: 6, width: 3.2, headingTolerance: 12 },
      parTime: 40,
    }),
    defineLevel({
      id: 'pillar-turn',
      bounds: { x: 0, y: 0, w: 30, h: 38 },
      ground: 'garage',
      draw: (m) => {
        m.surface('garage', 4, 0.5, 26, 37.5);
        m.wall(3.6, 0, 0.4, 38).wall(3.6, 0, 26.4, 0.5);
        const sideLines = evenly(14, 2.8, 9);
        m.bayDividers(12, 17, sideLines);
        sideLines.slice(0, -1).forEach((y, i) => {
          if (i !== 3) m.car(14.6, y + 1.4, i % 2 === 0 ? 0 : 180);
        });
        m.wall(17, 13.6, 0.4, 24.4);
        const northLines = evenly(12.6, 2.8, 7);
        for (const x of northLines) m.line(x, 0.5, x, 5.5);
        northLines.slice(0, -1).forEach((x, i) => {
          if (i !== 2) m.car(x + 1.4, 3, i % 2 === 0 ? 90 : -90);
        });
        m.pillar(11.7, 13.7, 0.6).pillar(19.6, 5.8, 0.6).pillar(26.6, 5.8, 0.6);
        m.arrow(8, 30, -90).arrow(22, 9.75, 0);
      },
      start: { x: 8, y: 32, heading: -90 },
      target: { x: 25, y: 9.75, heading: 0, length: 6, width: 3.4, headingTolerance: 12 },
      parTime: 40,
    }),
    defineLevel({
      id: 'narrow-gate',
      bounds: { x: 0, y: 0, w: 26, h: 34 },
      draw: (m) => {
        m.asphalt(4, 0, 9, 34).kerb(3.7, 0, 0.3, 34).surface('pavement', 1, 0, 2.7, 34);
        m.surface('gravel', 13.3, 12, 10.7, 12);
        m.hedge(13, 0, 0.3, 16.3).hedge(13, 19.9, 0.3, 14.1);
        m.post(13.15, 16.45).post(13.15, 19.75);
        m.hedge(13.3, 11.7, 10.7, 0.3).hedge(13.3, 24, 10.7, 0.3).hedge(24, 11.7, 0.3, 12.6);
        m.building(14.5, 25.5, 9, 7).building(14.5, 2, 9, 8);
      },
      start: { x: 6, y: 30, heading: -90 },
      target: { x: 19.5, y: 18.1, heading: 0, length: 5.4, width: 2.8, headingTolerance: 10 },
      parTime: 45,
    }),
    defineLevel({
      id: 'cone-slalom',
      bounds: { x: 0, y: 0, w: 20, h: 44 },
      draw: (m) => {
        m.asphalt(4, 0, 12, 44).kerb(3.7, 0, 0.3, 44).kerb(16, 0, 0.3, 44);
        m.line(4.4, 0, 4.4, 44).line(15.6, 0, 15.6, 44);
        for (const y of [32, 25, 18, 11]) m.cone(10, y);
        trees(m, [[1.8, 8], [1.8, 30], [18.2, 18], [18.2, 38]]);
      },
      start: { x: 10, y: 40, heading: -90 },
      target: { x: 10, y: 3.5, heading: -90, length: 6, width: 3.4, headingTolerance: 15 },
      checkpoints: [
        { x: 7, y: 32, r: 2.2 },
        { x: 13, y: 25, r: 2.2 },
        { x: 7, y: 18, r: 2.2 },
        { x: 13, y: 11, r: 2.2 },
      ],
      parTime: 50,
    }),
    defineLevel({
      id: 'u-turn',
      bounds: { x: 0, y: 0, w: 22, h: 38 },
      draw: (m) => {
        m.asphalt(4, 0, 14, 38).kerb(3.7, 0, 0.3, 38).kerb(18, 0, 0.3, 38);
        m.surface('pavement', 0.8, 0, 2.9, 38).surface('pavement', 18.3, 0, 2.9, 38);
        m.dashed(11, 0, 11, 38);
        m.car(16.8, 4, -90).car(16.8, 9.5, -90).car(5.2, 6, 90);
      },
      start: { x: 15.5, y: 33, heading: -90 },
      target: { x: 7, y: 25, heading: 90, length: 9, width: 3.4, headingTolerance: 12 },
      parTime: 45,
    }),
  ],
};

const reversing: Chapter = {
  id: 'reversing',
  levels: [
    defineLevel({
      id: 'reverse-corner',
      bounds: { x: 0, y: 0, w: 30, h: 32 },
      draw: (m) => {
        m.asphalt(4, 0, 8, 32).asphalt(12, 16, 18, 8);
        m.kerb(0, 0, 4, 32).kerb(12, 0, 18, 16).kerb(12, 24, 18, 8);
        m.building(0, 0, 2, 32).building(14, 0, 14, 13).building(14, 26.5, 14, 5.5);
        m.dashed(8, 0, 8, 16).dashed(8, 24, 8, 32).dashed(12, 20, 30, 20);
      },
      start: { x: 9.5, y: 7, heading: -90 },
      target: { x: 22, y: 18.5, heading: 180, length: 6.5, width: 3.2, headingTolerance: 10 },
      parTime: 50,
    }),
    defineLevel({
      id: 'reverse-driveway',
      bounds: { x: 0, y: 0, w: 26, h: 32 },
      draw: (m) => {
        m.asphalt(4, 0, 8, 32).kerb(3.7, 0, 0.3, 32).surface('pavement', 1, 0, 2.7, 32);
        m.surface('concrete', 12.4, 17.7, 9.6, 3.8);
        m.hedge(12, 0, 0.4, 17.7).hedge(12, 21.5, 0.4, 10.5);
        m.post(12.15, 17.85).post(12.15, 21.35);
        m.hedge(12.4, 17.4, 9.6, 0.3).hedge(12.4, 21.5, 9.6, 0.3);
        m.building(22, 14, 4, 11);
        m.car(10.2, 2.5, -90);
        trees(m, [[17, 8], [20, 28]]);
      },
      start: { x: 6, y: 10, heading: -90 },
      target: { x: 17.5, y: 19.6, heading: 180, length: 5.2, width: 2.9, headingTolerance: 8 },
      parTime: 50,
    }),
    defineLevel({
      id: 'reverse-out',
      bounds: { x: 0, y: 0, w: 24, h: 30 },
      draw: (m) => {
        m.asphalt(4, 0, 14, 30).wall(3.6, 0, 0.4, 30).kerb(18, 0, 0.3, 30);
        const lines = evenly(3.15, 2.7, 10);
        m.bayDividers(4, 9, lines);
        const centres = lines.slice(0, -1).map((y) => y + 1.35);
        centres.forEach((y, i) => {
          if (i !== 5 && i !== 2) m.car(6.6, y, i % 2 === 0 ? 180 : 0);
        });
        m.arrow(13.5, 24, -90).arrow(13.5, 12, -90);
        trees(m, [[21, 8], [21, 22]]);
      },
      start: { x: 6.5, y: 18, heading: 180 },
      target: { x: 13.5, y: 5, heading: -90, length: 7, width: 4, headingTolerance: 15 },
      parTime: 50,
    }),
  ],
};

const parking: Chapter = {
  id: 'parking',
  levels: [
    defineLevel({
      id: 'bay-forward',
      bounds: { x: 0, y: 0, w: 24, h: 36 },
      draw: (m) => bayLot(m, [3, 8], [1, 7]),
      start: { x: 14, y: 32, heading: -90 },
      target: { x: 6.5, y: 12, heading: 180, length: 5, width: 2.7, headingTolerance: 8 },
      parTime: 50,
    }),
    defineLevel({
      id: 'bay-reverse',
      bounds: { x: 0, y: 0, w: 24, h: 36 },
      draw: (m) => bayLot(m, [5, 9], [2, 8]),
      start: { x: 13, y: 30, heading: -90 },
      target: { x: 6.5, y: 17.4, heading: 0, length: 5, width: 2.7, headingTolerance: 8 },
      parTime: 60,
    }),
    defineLevel({
      id: 'angled-bay',
      bounds: { x: 0, y: 0, w: 22, h: 38 },
      draw: (m) => {
        m.asphalt(4.2, 0, 10.8, 38).kerb(3.9, 0, 0.3, 38).kerb(15, 0, 0.3, 38);
        const axis = { x: -Math.cos(Math.PI / 6), y: -Math.sin(Math.PI / 6) };
        const lineYs = evenly(34, -3.118, 10);
        for (const y of lineYs) m.line(9, y, 9 + axis.x * 5.5, y + axis.y * 5.5);
        lineYs.slice(0, -1).forEach((y, i) => {
          if (i !== 4 && i !== 7) m.car(6.75, y - 2.86, 210);
        });
        m.arrow(12, 30, -90).arrow(12, 14, -90);
        trees(m, [[1.8, 6], [1.8, 24], [18.5, 12], [18.5, 30]]);
      },
      start: { x: 12, y: 35, heading: -90 },
      target: { x: 6.75, y: 18.67, heading: 210, length: 5, width: 2.7, headingTolerance: 8 },
      parTime: 45,
    }),
    defineLevel({
      id: 'parallel-park',
      bounds: { x: 0, y: 0, w: 22, h: 34 },
      draw: (m) => {
        parallelStreet(m);
        m.car(14.8, 3.3, -90).car(14.8, 9.75, -90).car(14.8, 21.45, -90).car(14.8, 28.4, -90);
      },
      start: { x: 12.4, y: 30, heading: -90 },
      target: { x: 14.8, y: 15.6, heading: -90, length: 6.6, width: 2.4, headingTolerance: 6 },
      parTime: 75,
    }),
    defineLevel({
      id: 'leave-parallel',
      bounds: { x: 0, y: 0, w: 22, h: 34 },
      draw: (m) => {
        parallelStreet(m);
        m.car(14.8, 9.75, -90).car(14.8, 20.85, -90).car(14.8, 27.6, -90);
      },
      start: { x: 14.8, y: 15.3, heading: -90 },
      target: { x: 12, y: 2.5, heading: -90, length: 6, width: 3.4, headingTolerance: 15 },
      parTime: 50,
    }),
  ],
};

const tightSpots: Chapter = {
  id: 'tight-spots',
  levels: [
    defineLevel({
      id: 'three-point-turn',
      bounds: { x: 0, y: 0, w: 20, h: 34 },
      draw: (m) => {
        m.asphalt(6, 2, 7.5, 32);
        m.kerb(5.7, 1.7, 8.1, 0.3).kerb(5.7, 2, 0.3, 32).kerb(13.5, 2, 0.3, 32);
        m.surface('pavement', 3, 0, 2.7, 34).surface('pavement', 13.8, 0, 2.7, 34);
        m.hedge(2.5, 0, 0.5, 34).hedge(16.5, 0, 0.5, 34);
        m.car(12.3, 31.5, -90);
      },
      start: { x: 11.6, y: 26, heading: -90 },
      target: { x: 7.9, y: 24, heading: 90, length: 8, width: 3.4, headingTolerance: 12 },
      guides: false,
      parTime: 75,
    }),
    defineLevel({
      id: 'garage-pillars',
      bounds: { x: 0, y: 0, w: 22, h: 36 },
      ground: 'garage',
      draw: (m) => {
        m.surface('garage', 4, 0.5, 16.5, 35.5);
        m.wall(3.6, 0, 0.4, 36).wall(20.5, 0, 0.5, 36).wall(3.6, 0, 17.4, 0.5);
        const lines = evenly(2, 2.8, 12);
        m.bayDividers(4, 9, lines).bayDividers(15.5, 20.5, lines);
        for (const y of [7.6, 16, 24.4, 32.8]) m.pillar(7, y - 0.225, 0.45).pillar(17.5, y - 0.225, 0.45);
        lines.slice(0, -1).forEach((line, i) => {
          const y = line + 1.4 - 0.1;
          if (i !== 5 && i !== 8) m.car(6.6, y, i % 2 === 0 ? 0 : 180);
          if (i !== 2 && i !== 9) m.car(18, y, i % 3 === 0 ? 180 : 0);
        });
        m.arrow(12.25, 26, -90).arrow(12.25, 8, -90);
      },
      start: { x: 12.25, y: 32, heading: -90 },
      target: { x: 6.5, y: 17.4, heading: 0, length: 5, width: 2.8, headingTolerance: 8 },
      parTime: 70,
    }),
    defineLevel({
      id: 'home-garage',
      bounds: { x: 0, y: 0, w: 24, h: 32 },
      draw: (m) => {
        m.surface('pavement', 8.7, 8, 6.6, 24).surface('concrete', 10.75, 2, 2.5, 6);
        m.building(1, 0, 9.5, 8).building(13.5, 0, 9.5, 8);
        m.wall(10.5, 1.5, 0.25, 6.5).wall(13.25, 1.5, 0.25, 6.5).wall(10.5, 1.5, 3, 0.5);
        m.hedge(8.4, 8, 0.3, 24).hedge(15.3, 8, 0.3, 24);
        trees(m, [[4, 14], [4, 26], [20, 16], [20, 27]]);
      },
      start: { x: 13.2, y: 25, heading: -95 },
      target: { x: 12, y: 4.9, heading: -90, length: 5.8, width: 2.5, headingTolerance: 5 },
      parTime: 60,
    }),
    defineLevel({
      id: 'ramp-turn',
      bounds: { x: 3, y: 2, w: 22, h: 34 },
      ground: 'garage',
      draw: (m) => {
        m.surface('garage', 6.8, 12, 14.4, 24).ring('garage', 14, 12, 0, 7.2, 180, 360);
        m.ring('pavement', 14, 12, 0, 3, 180, 360);
        m.kerb(11, 12, 6, 24).arc('kerb', 14, 12, 2.7, 3, 180, 360);
        m.wall(6.4, 12, 0.4, 24).wall(21.2, 12, 0.4, 24).arc('wall', 14, 12, 7.2, 7.6, 180, 360);
        m.arcLine(14, 12, 5.1, 180, 360, { dash: [1.2, 1.8] });
        m.arrow(19.1, 24, -90).arrow(8.9, 20, 90);
      },
      start: { x: 19.1, y: 31, heading: -90 },
      target: { x: 8.9, y: 27, heading: 90, length: 7, width: 3.4, headingTolerance: 10 },
      parTime: 50,
    }),
    defineLevel({
      id: 'crooked-neighbour',
      bounds: { x: 0, y: 0, w: 24, h: 36 },
      draw: (m) => {
        bayLot(m, [5, 6, 9], [2]);
        m.car(6.6, 19.8, 192, '#8e3b36');
      },
      start: { x: 13, y: 30, heading: -90 },
      target: { x: 6.5, y: 17.3, heading: 0, length: 5, width: 2.7, headingTolerance: 8 },
      guides: false,
      parTime: 75,
      maxTouches: 2,
    }),
  ],
};

export const CHAPTERS: Chapter[] = [basics, turning, reversing, parking, tightSpots];

export const LEVELS: Level[] = CHAPTERS.flatMap((chapter) => chapter.levels);

export function chapterOf(level: Level): Chapter {
  return CHAPTERS.find((chapter) => chapter.levels.includes(level)) ?? CHAPTERS[0];
}
