import { windowSize } from './windowSize';
import { computed } from '@angular/core';


export function scale(base_width: number, base_height: number){
  const window = windowSize();

  return computed(() => {
    const ww = window().width;
    const wh = window().height;
    if(ww >= wh)
      return .8 * ww / base_width;
    return .8 * wh / base_height
  });
}
