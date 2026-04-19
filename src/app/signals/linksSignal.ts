import { effect, signal } from '@angular/core';
import { Direction, getNearestStars } from '../data/distance_computation';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';

export function pathLinkSignal() {
  const linksSignal = signal<[number, number, Direction][]>(getStartingLinks());

  function getPath() {
    const links = linksSignal();
    if (!links.length) return;
    let str = '';
    for (let [index_a, index_b] of links) {
      const neighbourIndex = getNearestStars(index_a).findIndex(([index]) => index === index_b);
      const fullNumber = (index_a << 4) + neighbourIndex;
      const firstpart = fullNumber >> 6;
      const secondpart = fullNumber & 63;
      str += chars[firstpart];
      str += chars[secondpart];
    }
    return str;
  }

  effect(() => {
    const path = getPath();
    if (!path) return;
    const url = new URL(window.location.href);
    url.searchParams.set('s', path);
    history.pushState(null, '', url);
  });

  return linksSignal
}

const getStartingLinks = () => {
  const paramString = window.location.search;
  const params = new URLSearchParams(paramString);
  const path = params.get('s') ?? '';
  if (!path || path.length % 2 !== 0) return [];
  const links: [number, number, Direction][] = [];
  for (let i = 0; i < path.length; i += 2) {
    const firstPart = chars.indexOf(path[i]);
    const secondPart = chars.indexOf(path[i + 1]);
    const fullNumber = (firstPart << 6) + secondPart;
    const starIndex = fullNumber >> 4;
    const neighbourIndex = fullNumber & 15;
    const otherStarIndex = getNearestStars(starIndex)[neighbourIndex];
    if (!otherStarIndex) return [];
    links.push([starIndex, ...otherStarIndex]);
  }
  return links;
};


