export class Improvement {
  static availableOn(terrain) {
    // TODO: use RulesRegistry so things like rivers necessitate Bridge Building
    return this.available.some((constructor) => terrain instanceof constructor);
  }
}

export default Improvement;