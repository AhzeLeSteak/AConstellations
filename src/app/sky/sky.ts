import centers from '../data/centers.json';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Star } from '../star/star';
import { StarService } from '../services/star.service';

@Component({
  selector: 'app-sky',
  imports: [Star],
  templateUrl: './sky.html',
  styleUrl: './sky.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sky {
  stars = centers;
  starService = inject(StarService);
}
