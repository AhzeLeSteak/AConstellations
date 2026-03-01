import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import centers from './centers.json';
import { Star } from './star/star';

type Link = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Star],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  centers = centers;

  selectedIndex = signal<number | null>(null);

  blueLinks = signal<Link[]>([])

  nearestStars = computed(() => {
    if (this.selectedIndex() === null) return [];
    const selectedStar = this.centers[this.selectedIndex()!];
    return this.centers
      .toSorted((a, b) => dist_sqr(a, selectedStar) - dist_sqr(b, selectedStar))
      .slice(1, 7);
  })

  redLinks = computed<Link[]>(() => {
    if (!this.selectedIndex()!) return [];
    const selectedStar = this.centers[this.selectedIndex()!];
    const ratio = 0.2;
    return this.nearestStars().map(star => ({
      x1: star.x * ratio + selectedStar.x * (1 - ratio),
      y1: star.y * ratio + selectedStar.y * (1 - ratio),
      x2: star.x * (1 - ratio) + selectedStar.x * ratio,
      y2: star.y * (1 - ratio) + selectedStar.y * ratio,
    }));
  });

  protected onSelectStar(starIndex: number) {
    const newSelectedStart = this.centers[starIndex];
    if(this.nearestStars().includes(newSelectedStart) && this.selectedIndex()) {
      const currentSelectedStar = this.centers[this.selectedIndex()!];
      this.blueLinks.update(links => [...links, {
        x1: newSelectedStart.x,
        y1: newSelectedStart.y,
        x2: currentSelectedStar.x,
        y2: currentSelectedStar.y,
      }])
    }
    this.selectedIndex.set(starIndex);
  }

  protected removeLink(link: Link) {
    this.blueLinks.update(arr => arr.filter(el => el !== link));
  }
}

type Point = {
  x: number;
  y: number;
};
function dist_sqr(a: Point, b: Point) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}
