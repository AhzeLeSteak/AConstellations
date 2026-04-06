import centers from '../centers.json';
import { Component, inject, input } from '@angular/core';
import { Star } from '../star/star';
import { StarService } from '../star.service';

@Component({
  selector: 'app-sky',
  imports: [Star],
  templateUrl: './sky.html',
  styleUrl: './sky.css',
})
export class Sky {
  debugColor = input('black');
  stars = centers
  starService = inject(StarService);
}
