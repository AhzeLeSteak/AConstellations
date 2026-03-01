import { Component, computed, effect, input, output } from '@angular/core';
import { concatMap, delay, map, mergeMap, of, repeat, retry, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-star',
  imports: [NgOptimizedImage],
  templateUrl: './star.html',
  styleUrl: './star.css',
})
export class Star {
  public star = input.required<{ x: number; y: number; size: number }>();
  public selected = input.required<boolean>();
  public onClick = output();

  src = computed(() =>
    this.selected() ? 'selected.png' : `${this.star().size}${this.oscillate() ? 'A' : 'B'}.png`,
  );

  size = computed(() => (this.selected()
    ? 7
    : this.star().size === 1
      ? 1
      : 3
  ));

  private oscillate = toSignal(
    of(true, false).pipe(
      concatMap((x) => of(x).pipe(delay(this.randomTime()))),
      //tap((value) => console.log(`star`, value)),
      repeat(),
    ),
    { initialValue: true },
  );

  private randomTime() {
    return 1500 + Math.random() * 4500;
  }
}
