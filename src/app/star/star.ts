import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { randomOscillation } from '../services/oscillate';

@Component({
  selector: 'app-star',
  imports: [],
  templateUrl: './star.html',
  styleUrl: './star.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Star {
  public star = input.required<{ x: number; y: number; size: number }>();
  public selected = input.required<boolean>();
  public onClick = output();

  public oscillate = randomOscillation();

  src = computed(() =>
    this.selected() ? 'selected.png' : `${this.star().size}${this.oscillate() ? 'A' : 'B'}.png`,
  );

  size = computed(() => 7);
}
