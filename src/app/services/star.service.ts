import { computed, effect, Injectable, signal } from '@angular/core';
import centers from '../data/centers.json';
import { sky_height, sky_width } from '../data/sky_size';

const dist_threshold = 1500;

@Injectable({
  providedIn: 'root',
})
export class StarService {
  stars = centers;
  selectedIndex = signal<number | null>(null);
  //_ = effect(() => console.log(this.selectedIndex()))

  nearestStars = computed(() => {
    const selectedIndex = this.selectedIndex();
    if (selectedIndex === null) return [];
    const selectedStar = this.stars[selectedIndex];
    return this.stars
      .map((s, i) => [i, ...dist_sqr(selectedStar, s)] as const)
      .filter(
        ([i, dist]) =>
          i !== selectedIndex && dist < dist_threshold && !this.linksExists(i, selectedIndex),
      )
      .map(([i, _, dir]) => [i, dir] as const);
  });

  links = signal<Array<[number, number, Direction]>>([]);
  blueLinks = computed<Link[]>(() =>
    this.links().flatMap(([index_a, index_b, dir]) => this.makeLink(index_a, index_b, dir)),
  );
  suggestionLinks = computed<Link[]>(() => {
    const selectedIndex = this.selectedIndex();
    return selectedIndex === null
      ? []
      : this.nearestStars().flatMap(([starIndex, dir]) =>
          this.makeLink(selectedIndex, starIndex, dir, 0.25),
        );
  });

  private makeLink(
    starIndexA: number,
    starIndexB: number,
    dir: Direction,
    ratio = 0,
  ): Link | [Link, Link] {
    const selectedStar = this.stars[starIndexA];
    const star = this.stars[starIndexB];
    const dx = get_dx(dir);
    const dy = get_dy(dir);
    const base_link = {
      x1: (star.x - dx) * (1 - ratio) + selectedStar.x * ratio,
      y1: (star.y - dy) * (1 - ratio) + selectedStar.y * ratio,
      x2: selectedStar.x * (1 - ratio) + (star.x - dx) * ratio,
      y2: selectedStar.y * (1 - ratio) + (star.y - dy) * ratio,
    };
    return dir === 0
      ? base_link
      : [
          base_link,
          {
            x1: base_link.x1 + dx,
            y1: base_link.y1 + dy,
            x2: base_link.x2 + dx,
            y2: base_link.y2 + dy,
          },
        ];
  }

  public onSelectStar(newIndex: number) {
    const oldSelectedIndex = this.selectedIndex();
    if (oldSelectedIndex !== null) {
      const starAndDir = this.nearestStars().find(([index]) => index === newIndex);
      if (starAndDir && !this.linksExists(oldSelectedIndex, newIndex)) {
        this.links.update((links) => [...links, [oldSelectedIndex, newIndex, starAndDir[1]]]);
      }
    }

    this.selectedIndex.set(newIndex);
  }

  public removeLink(linkIndex: number) {
    this.links.update((arr) => arr.filter((_, i) => i !== linkIndex));
  }

  private linksExists(ia: number, ib: number) {
    return this.links().some(([a, b]) => (a === ia && b === ib) || (a === ib && b === ia));
  }
}

enum Direction {
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

function get_dx(dir: Direction) {
  return (dir & Direction.WEST ? -1 : dir & Direction.EAST ? 1 : 0) * sky_width;
}

function get_dy(dir: Direction) {
  return (dir & Direction.NORTH ? -1 : dir & Direction.SOUTH ? 1 : 0) * sky_height;
}

export type Point = {
  x: number;
  y: number;
};
