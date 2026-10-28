import type { Box } from './geometry.ts';

export type SurfaceKind = 'asphalt' | 'pavement' | 'grass' | 'concrete' | 'garage' | 'gravel';
export type GroundKind = 'grass' | 'garage';

export type Surface =
  | { shape: 'rect'; kind: SurfaceKind; box: Box }
  | { shape: 'ring'; kind: SurfaceKind; cx: number; cy: number; r1: number; r2: number; a0: number; a1: number };

export type PaintColor = 'white' | 'yellow';

export type Marking =
  | { shape: 'line'; x1: number; y1: number; x2: number; y2: number; width: number; color: PaintColor; dash?: number[] }
  | { shape: 'arc'; cx: number; cy: number; r: number; a0: number; a1: number; width: number; color: PaintColor; dash?: number[] }
  | { shape: 'arrow'; x: number; y: number; heading: number };

export type ObstacleKind =
  | 'kerb'
  | 'wall'
  | 'hedge'
  | 'building'
  | 'car'
  | 'cone'
  | 'pillar'
  | 'post'
  | 'planter'
  | 'edge';

export type Obstacle =
  | { shape: 'box'; kind: ObstacleKind; box: Box; color?: string }
  | { shape: 'circle'; kind: ObstacleKind; x: number; y: number; r: number };

export interface MapData {
  ground: GroundKind;
  surfaces: Surface[];
  markings: Marking[];
  obstacles: Obstacle[];
}

/** Car centre position in metres; heading in degrees, 0 = east, 90 = south (y points down). */
export interface StartPose {
  x: number;
  y: number;
  heading: number;
}

export interface TargetZone {
  x: number;
  y: number;
  heading: number;
  length: number;
  width: number;
  headingTolerance: number;
  either?: boolean;
}

export interface Checkpoint {
  x: number;
  y: number;
  r: number;
}

export interface Level {
  id: string;
  title: string;
  goal: string;
  tips: string[];
  bounds: { x: number; y: number; w: number; h: number };
  map: MapData;
  start: StartPose;
  target: TargetZone;
  checkpoints: Checkpoint[];
  guides: boolean;
  parTime: number;
  maxTouches?: number;
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  levels: Level[];
}
