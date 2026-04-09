import { Component, computed, inject, input, output } from '@angular/core';
import { Oscillate } from '../services/oscillate';

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

  public oscillate = inject(Oscillate).getRandomOscillation()

  src = computed(() =>
    this.selected() ? 'selected.png' : `${this.star().size}${this.oscillate() ? 'A' : 'B'}.png`,
  );

  size = computed(() => 7);


}
