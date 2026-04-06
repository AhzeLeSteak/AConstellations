import { computed, effect, Injectable, signal } from '@angular/core';
import centers from './centers.json';


@Injectable({
  providedIn: 'root',
})
export class StarService {
  stars = centers;
  selectedIndex = signal<number | null>(null);

  links = signal<Array<[number, number]>>([]);
  blueLinks = computed<Link[]>(() =>
    this.links().map(([a, b]) => ({
      x1: this.stars[a].x,
      y1: this.stars[a].y,
      x2: this.stars[b].x,
      y2: this.stars[b].y,
    })),
  );

  nearestStars = computed(() => {
    if (this.selectedIndex() === null) return [];
    const selectedStar = this.stars[this.selectedIndex()!];
    return this.stars
      .filter((s) => dist_sqr(s, selectedStar) < 1500)
      .filter((s) => !this.linksExists(s, selectedStar));
  });

  suggestionLinks = computed<Link[]>(() => {
    if (!this.selectedIndex()!) return [];
    const selectedStar = this.stars[this.selectedIndex()!];
    const ratio = 0.2;
    return this.nearestStars().map((star) => ({
      x1: star.x * ratio + selectedStar.x * (1 - ratio),
      y1: star.y * ratio + selectedStar.y * (1 - ratio),
      x2: star.x * (1 - ratio) + selectedStar.x * ratio,
      y2: star.y * (1 - ratio) + selectedStar.y * ratio,
    }));
  });

  private updateUrl = effect(() => {
    if ('URLSearchParams' in window) {
      const url = new URL(window.location.href);
      const toEncode = this.links()
        .map(([a, b]) => `${a},${b}`)
        .join('&');
      console.log(JSON.stringify(toEncode));
      url.searchParams.set('path', btoa(toEncode));
      history.pushState(null, '', url);
    }
  });

  public onSelectStar(starIndex: number) {
    const newSelectedStart = this.stars[starIndex];
    if (this.nearestStars().includes(newSelectedStart) && this.selectedIndex()) {
      const currentSelectedStar = this.stars[this.selectedIndex()!];
      if (!this.linksExists(currentSelectedStar, newSelectedStart))
        this.links.update((links) => [...links, [starIndex, this.selectedIndex()!]]);
      console.log(this.blueLinks());
    }
    this.selectedIndex.set(starIndex);
  }

  public removeLink(link: Link) {
    this.links.update((arr) =>
      arr.filter(
        ([a, b]) =>
          this.stars[a].x !== link.x1 &&
          this.stars[a].y !== link.y1 &&
          this.stars[b].x !== link.x2 &&
          this.stars[b].y !== link.y2,
      ),
    );
  }

  private linksExists({ x: xa, y: ya }: Point, { x: xb, y: yb }: Point) {
    return this.blueLinks().some(
      ({ x1, y1, x2, y2 }) =>
        (x1 === xa && y1 == ya && x2 == xb && y2 == yb) ||
        (x2 === xa && y2 == ya && x1 == xb && y1 == yb),
    );
  }
}

function dist_sqr(a: Point, b: Point) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export type Point = {
  x: number;
  y: number;
};
