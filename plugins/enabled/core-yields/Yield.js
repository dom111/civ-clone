import YieldModifiers from './YieldModifiers.js';

export class Yield {
  #cachedTotal = false;
  #modifiers = new YieldModifiers();
  #value = 0;

  constructor(value = 0) {
    if (value instanceof Yield) {
      this.#value = value.value();

      return;
    }

    this.#value += value;
  }

  add(value) {
    this.#cachedTotal = false;

    if (value instanceof Yield) {
      this.#value += value.value();

      return;
    }

    this.#value += value;
  }

  addModifier(...modifiers) {
    this.#cachedTotal = false;
    this.#modifiers.add(...modifiers);
  }

  modifiers() {
    return this.#modifiers;
  }

  set(value) {
    this.#cachedTotal = false;

    if (value instanceof Yield) {
      this.#value = value.value();

      return;
    }

    this.#value = value;
  }

  subtract(value) {
    this.#cachedTotal = false;

    if (value instanceof Yield) {
      this.#value -= value.value();

      return;
    }

    this.#value -= value;
  }

  value() {
    if (this.#cachedTotal === false) {
      this.#cachedTotal = this.#modifiers.apply(this.#value);
    }

    return this.#cachedTotal;
  }

  valueOf() {
    return this.value();
  }
}

export default Yield;