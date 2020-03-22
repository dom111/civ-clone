import {YieldModifier} from './YieldModifier.js';

export class YieldModifiers {
  #stack = [];

  add(...yieldModifiers) {
    yieldModifiers.forEach((yieldModifier) => {
      if (! (yieldModifier instanceof YieldModifier)) {
        throw new TypeError(`Expected instance of 'YieldModifier', got '${yieldModifier.constructor.name}'`);
      }

      this.#stack.push(yieldModifier);
    });
  }

  apply(value) {
    return this.#stack
      // sorting by highest priority first
      .sort((a, b) => b.priority() - a.priority())
      .reduce((total, yieldModifier) => total + yieldModifier.apply(value), value)
    ;
  }

  get(Modifier) {
    return this.#stack
      .filter((modifier) => modifier instanceof Modifier)
    ;
  }

  modifiers() {
    return [...this.#stack];
  }

  has(Modifier) {
    return this.#stack
      .some((modifier) => modifier instanceof Modifier)
    ;
  }
}

export default YieldModifiers;
