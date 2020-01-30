import {YieldModifier} from './YieldModifier.js';

export class YieldModifiers {
  #stack = [];

  add(...yieldModifiers) {
    yieldModifiers.forEach((yieldModifier) => {
      if (! (yieldModifier instanceof YieldModifier)) {
        throw new TypeError(`Expected instance of 'YieldModifier', got ${yieldModifier || yieldModifier.constructor.name}`);
      }

      this.#stack.push(yieldModifier);
    });
  }

  apply(value) {
    return this.#stack
      // sorting by highest priority first
      .sort((a, b) => b.priority - a.priority)
      .reduce((total, yieldModifier) => yieldModifier.apply(total), value)
    ;
  }
}

export default YieldModifiers;
