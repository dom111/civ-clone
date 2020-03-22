import AdvanceRegistry from '../core-science/AdvanceRegistry.js';
import {Research} from './Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class PlayerResearch {
  #advanceRegistry;
  #complete = [];
  #researching;
  #player;
  #cost = new Research(Infinity);
  #progress = new Research(0);
  #rulesRegistry;

  constructor({
    advanceRegistry = AdvanceRegistry.getInstance(),
    player,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    this.#advanceRegistry = advanceRegistry;
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;
  }

  add(researchYield) {
    if (! (researchYield instanceof Research)) {
      throw new TypeError(`PlayerResearch#add: Expected instance of 'Research', got '${researchYield && researchYield.constructor.name}'`);
    }

    this.#progress.add(researchYield);

    this.check();
  }

  available() {
    const rules = this.#rulesRegistry.get('research:requirements');

    return this.#advanceRegistry.filter((Advance) => rules
      .filter((rule) => rule.validate(Advance, this.#complete))
      .every((rule) => rule.process(Advance, this.#complete) === true)
    )
      .filter((Advance) => ! this.#complete.some((advance) => advance instanceof Advance))
    ;
  }

  check() {
    if (this.researching() && (this.#progress.value() >= this.#cost.value())) {
      const completedResearch = new (this.#researching)();

      this.#rulesRegistry.process('player:research-complete', this.#player, completedResearch);

      this.#complete.push(completedResearch);
      this.#researching = null;
      this.#progress.subtract(this.#cost);

      if (this.#progress.value() < 0) {
        this.#progress.set(0);
      }

      this.#cost.set(Infinity);
    }
  }

  complete() {
    return this.#complete;
  }

  completed(Advance) {
    return this.#complete
      .some((advance) => advance instanceof Advance)
    ;
  }

  cost() {
    return this.#cost;
  }

  player() {
    return this.#player;
  }

  progress() {
    return this.#progress;
  }

  research(Advance) {
    const [cost] = this.#rulesRegistry.process('research:cost', Advance, this);

    this.#cost.set(cost);
    this.#researching = Advance;

    this.#rulesRegistry.process('player:research', this.#player, Advance);
  }

  researching() {
    return this.#researching;
  }
}

export default PlayerResearch;
