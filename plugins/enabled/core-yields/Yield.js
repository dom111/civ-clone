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

  hasModifier(Modifier) {
    return this.#modifiers.some((modifier) => modifier instanceof Modifier);
  }

  get modifiers() {
    return this.#modifiers.slice(0);
  }

  removeModifier(modifier) {
    return this.#modifiers.splice(this.#modifiers.indexOf(modifier), 1);
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