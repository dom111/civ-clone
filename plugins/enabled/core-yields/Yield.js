import YieldModifiers from './YieldModifiers.js';

export class Yield {
  #modifiers = new YieldModifiers();
  #value = 0;

  constructor(value = 0) {
    this.#value += value;
  }

  add(n) {
    this.#value += n;
  }

  addModifier(...modifiers) {
    this.#modifiers.add(...modifiers);
  }

  subtract(n) {
    this.#value -= n;
  }

  value() {
    return this.#modifiers.apply(this.#value);
  }

  valueOf() {
    return this.value();
  }
}

export default Yield;