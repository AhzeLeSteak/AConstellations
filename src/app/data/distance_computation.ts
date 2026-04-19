import centers from './centers.json';

const dist_threshold = 1500;

export const sky_height = 298;
export const sky_width = 512;

export enum Direction {
  NONE = 0,
  NORTH = 1,
  SOUTH = 2,
  EAST = 4,
  WEST = 8,
  NORTH_EAST = Direction.NORTH | Direction.EAST,
  NORTH_WEST = Direction.NORTH | Direction.WEST,
  SOUTH_EAST = Direction.SOUTH | Direction.EAST,
  SOUTH_WEST = Direction.SOUTH | Direction.WEST,
}

export function getNearestStars(starIndex: number) {
  const selectedStar = centers[starIndex];
  return centers
    .map((s, i) => [i, ...dist_sqr(selectedStar, s)] as const)
    .filter(([i, dist]) => i !== starIndex && dist < dist_threshold)
    .map(([i, _, dir]) => [i, dir] as const);
}

function dist_sqr(selected: Point, other: Point): [number, Direction] {
  for (let dir of [
    Direction.NONE,
    Direction.NORTH,
    Direction.SOUTH,
    Direction.EAST,
    Direction.WEST,
    Direction.NORTH_EAST,
    Direction.NORTH_WEST,
    Direction.SOUTH_EAST,
    Direction.SOUTH_WEST,
  ]) {
    const dx = get_dx(dir);
    const dy = get_dy(dir);
    const dist_in_same_space = (selected.x - other.x + dx) ** 2 + (selected.y - other.y + dy) ** 2;
    if (dist_in_same_space <= dist_threshold) return [dist_in_same_space, dir];
  }
  return [Infinity, Direction.NONE];
}

export function get_dx(dir: Direction) {
  return (dir & Direction.WEST ? -1 : dir & Direction.EAST ? 1 : 0) * sky_width;
}

export function get_dy(dir: Direction) {
  return (dir & Direction.NORTH ? -1 : dir & Direction.SOUTH ? 1 : 0) * sky_height;
}

export type Point = {
  x: number;
  y: number;
};
