import AdvanceRegistry from '../core-science/AdvanceRegistry.js';
import {Research} from './Yields.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class PlayerResearch {
  /** @type {AdvanceRegistry} */
  #advanceRegistry;
  /** @type {Advance[]} */
  #complete = [];
  /** @type {class} */
  #researching;
  /** @type {Player} */
  #player;
  /** @type {Research} */
  #cost = new Research(Infinity);
  /** @type {Research} */
  #progress = new Research(0);
  /** @type {RulesRegistry} */
  #rulesRegistry;

  /**
   * @param advanceRegistry {AdvanceRegistry}
   * @param player {Player}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({
    advanceRegistry = AdvanceRegistry.getInstance(),
    player,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    this.#advanceRegistry = advanceRegistry;
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;
  }

  /**
   * @param researchYield {Research}
   */
  add(researchYield) {
    if (! (researchYield instanceof Research)) {
      throw new TypeError(`PlayerResearch#add: Expected instance of 'Research', got '${researchYield && researchYield.constructor.name}'`);
    }

    this.#progress.add(researchYield);

    this.check();
  }

  /**
   * @param Advance {class}
   */
  addAdvance(Advance) {
    if (this.#complete
      .some((advance) => advance instanceof Advance)
    ) {
      return;
    }

    if (this.#researching === Advance) {
      this.#researching = null;
    }

    const completedResearch = new Advance();

    this.#complete.push(completedResearch);
    this.#rulesRegistry.process('player:research-complete', this, completedResearch);
  }

  /**
   * @returns {Advance[]}
   */
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

      this.#complete.push(completedResearch);
      this.#researching = null;
      this.#progress.subtract(this.#cost);

      if (this.#progress.value() < 0) {
        this.#progress.set(0);
      }

      this.#cost.set(Infinity);

      this.#rulesRegistry.process('player:research-complete', this, completedResearch);
    }
  }

  /**
   * @returns {Advance[]}
   */
  complete() {
    return this.#complete;
  }

  /**
   * @param Advance {class}
   * @returns {boolean}
   */
  completed(Advance) {
    return this.#complete
      .some((advance) => advance instanceof Advance)
    ;
  }

  /**
   * @returns {Research}
   */
  cost() {
    return this.#cost;
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }

  /**
   * @returns {Research}
   */
  progress() {
    return this.#progress;
  }

  /**
   * @param Advance {class}
   */
  research(Advance) {
    const [cost] = this.#rulesRegistry.process('research:cost', Advance, this);

    this.#cost.set(cost);
    this.#researching = Advance;

    this.#rulesRegistry.process('player:research', this, Advance);
  }

  /**
   * @returns {class}
   */
  researching() {
    return this.#researching;
  }
}

export default PlayerResearch;
