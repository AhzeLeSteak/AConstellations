import { inject, Injectable } from '@angular/core';
import { concatMap, delay, of, repeat } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
class Oscillate {

  private oscillations = new Array(5)
    .fill(0)
    .map(() => toSignal(
      of(true, false).pipe(
        concatMap((x) => of(x).pipe(delay(this.randomTime()))),
        repeat(),
      ),
      { initialValue: true },
    ));

  public getRandomOscillation(){
    return this.oscillations[Math.floor(Math.random() * this.oscillations.length)];
  }

  private randomTime() {
    return 1500 + Math.random() * 4500;
  }

}

export function randomOscillation(){
  return inject(Oscillate).getRandomOscillation()
}
