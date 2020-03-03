import AdvanceRegistry from '../core-science/AdvanceRegistry.js';
import {Research} from './Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class PlayerResearch {
  #complete = [];
  #researching;
  #player;
  #cost = 0;
  #progress = 0;

  constructor(player) {
    this.#player = player;
  }

  add(researchYield) {
    if (researchYield instanceof Research) {
      this.#progress += researchYield.value();
    }

    this.check();
  }

  available() {
    return AdvanceRegistry
      .filter((Advance) => RulesRegistry.get('research:requirements')
        .filter((rule) => rule.validate(Advance, this.#complete))
        .every((rule) => rule.process(Advance, this.#complete) === true)
      )
      .filter((Advance) => ! this.#complete.some((advance) => advance instanceof Advance))
    ;
  }

  check() {
    if (this.researching() && (this.#progress >= this.#cost)) {
      const completedResearch = new (this.#researching)();

      engine.emit('player:research-complete', this.#player, completedResearch);

      this.#complete.push(completedResearch);
      this.#researching = null;
      this.#progress -= this.#cost;

      if (this.#progress < 0) {
        this.#progress = 0;
      }

      this.#cost = 0;
    }
  }

  complete() {
    return [...this.#complete];
  }

  completed(Advance) {
    return this.#complete
      .some((advance) => advance instanceof Advance)
    ;
  }

  get player() {
    return this.#player;
  }

  research(Advance) {
    [this.#cost] = RulesRegistry.get('research:cost')
      .filter((rule) => rule.validate(Advance, this.#player))
      .map((rule) => rule.process(Advance, this.#player))
    ;

    this.#researching = Advance;

    engine.emit('player:research', this.#player, Advance);
  }

  researching() {
    return this.#researching;
  }
}

export default PlayerResearch;
