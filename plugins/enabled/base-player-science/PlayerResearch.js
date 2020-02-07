import AdvanceRegistry from '../core-science/AdvanceRegistry.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class PlayerResearch {
  #completedResearch = [];
  #currentResearch;
  #player;
  #researchCost = 0;
  #researchProgress = 0;

  constructor(player) {
    this.#player = player;
  }

  add(researchYield) {
    this.#researchProgress += researchYield;

    if (this.isResearching() && (this.#researchProgress > this.#researchCost)) {
      const completedResearch = new (this.#currentResearch)();

      engine.emit('player:research-complete', this.#player, completedResearch);

      this.#completedResearch.push(completedResearch);
      this.#currentResearch = null;
      this.#researchProgress -= this.#researchCost;
      this.#researchCost = Infinity;
    }
  }

  completedResearch() {
    return this.#completedResearch.slice(0);
  }

  availableResearch() {
    return AdvanceRegistry
      .filter((Advance) => RulesRegistry.get('research:advance')
        .filter((rule) => rule.validate(Advance, this.#completedResearch))
        .every((rule) => rule.process(Advance, this.#completedResearch) === true)
      )
      .filter((Advance) => ! this.#completedResearch.some((advance) => advance instanceof Advance))
    ;
  }

  hasCompleted(Advance) {
    return this.#completedResearch
      .some((advance) => advance instanceof Advance)
    ;
  }

  isResearching() {
    return !! this.#currentResearch;
  }

  get player() {
    return this.#player;
  }

  setResearch(Advance) {
    [this.#researchCost] = RulesRegistry.get('advance:cost')
      .filter((rule) => rule.validate(Advance))
      .map((rule) => rule.process())
    ;

    this.#currentResearch = Advance;

    engine.emit('player:research', this.#player, Advance);
  }
}

export default PlayerResearch;
