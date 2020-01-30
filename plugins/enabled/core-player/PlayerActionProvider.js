export class PlayerActionProvider {
  #provider;

  constructor(provider) {
    this.#provider = provider;
  }

  provide(...args) {
    return this.#provider(...args);
  }
}

export default PlayerActionProvider;
