import { Component, computed, input, output } from '@angular/core';
import { concatMap, delay, of, repeat } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-star',
  imports: [],
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

  size = computed(() => 7);

  private oscillate = toSignal(
    of(true, false).pipe(
      concatMap((x) => of(x).pipe(delay(this.randomTime()))),
      repeat(),
    ),
    { initialValue: true },
  );

  private randomTime() {
    return 1500 + Math.random() * 4500;
  }
}
