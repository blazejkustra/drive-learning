import type { SurfaceKind } from '../level-types.ts';

export const SURFACE_COLOURS: Record<SurfaceKind, string> = {
  asphalt: '#5c6066',
  pavement: '#cdc9c0',
  grass: '#8cb473',
  concrete: '#b8b4ab',
  garage: '#7a7d82',
  gravel: '#c9bea6',
};

export const COLOURS = {
  grass: '#8ab271',
  grassStripe: '#92b979',
  garageGround: '#3b3e43',
  paintWhite: '#f4f3ee',
  paintYellow: '#f2cf4a',
  kerb: '#ebe8e1',
  wall: '#575b61',
  wallTop: '#6d7178',
  hedge: '#4c7743',
  hedgeLight: '#5d8a52',
  building: '#b3aba0',
  buildingEdge: '#958c80',
  pillar: '#9b9da1',
  post: '#6b5b4a',
  tree: '#5a8749',
  treeLight: '#6f9c5c',
  cone: '#f07a28',
  playerCar: '#2f6fe0',
  tyre: '#1d2024',
  rearPath: '#38c8e3',
  frontPath: '#ffffff',
  swingPath: '#ffd23f',
  target: '#3fc27a',
  bump: '#ffd84a',
  shadow: 'rgba(0, 0, 0, 0.2)',
};
