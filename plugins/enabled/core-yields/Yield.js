import YieldModifiers from './YieldModifiers.js';

export class Yield {
  #cachedTotal = 0;
  #modifiers = new YieldModifiers();
  #value = 0;

  constructor(value = 0) {
    this.#value += value;
  }

  add(n) {
    this.#cachedTotal = false;
    this.#value += n;
  }

  addModifier(...modifiers) {
    this.#cachedTotal = false;
    this.#modifiers.add(...modifiers);
  }

  hasModifier(Modifier) {
    return this.#modifiers.some((modifier) => modifier instanceof Modifier);
  }

  get modifiers() {
    return this.#modifiers.slice(0);
  }

  removeModifier(modifier) {
    this.#cachedTotal = false;

    return this.#modifiers.splice(this.#modifiers.indexOf(modifier), 1);
  }

  subtract(n) {
    this.#cachedTotal = false;
    this.#value -= n;
  }

  value() {
    if (! this.#cachedTotal) {
      this.#cachedTotal = this.#modifiers.apply(this.#value);
    }

    return this.#cachedTotal;
  }

  valueOf() {
    return this.value();
  }
}

export default Yield;