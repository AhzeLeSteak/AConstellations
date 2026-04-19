import { computed, Injectable, signal } from '@angular/core';
import centers from '../data/centers.json';
import { Direction, get_dx, get_dy, getNearestStars } from '../data/distance_computation';
import { pathLinkSignal } from '../signals/linksSignal';

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
    return this.getNearestStars(selectedIndex);
  });

  links = pathLinkSignal();
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

  public getNearestStars(starIndex: number) {
    return getNearestStars(starIndex).filter(([i]) => !this.linksExists(starIndex, i));
  }

  private linksExists(ia: number, ib: number): boolean {
    return this.links().some(([a, b]) => (a === ia && b === ib) || (a === ib && b === ia));
  }
}

