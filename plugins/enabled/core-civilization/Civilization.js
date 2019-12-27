export default class Civilization {
  static #civilizations = [];

  static fromName(name) {
    return this.#civilizations.filter((civilization) => civilization.name === name)[0];
  }

  static register(civilization) {
    this.#civilizations.push(civilization);
  }

  static get civilizations() {
    return [
      ...this.#civilizations
    ];
  }
}
