import GoodyHutAction from '../core-goody-huts/GoodyHutAction.js';
import Horseman from '../base-unit-horseman/Horseman.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Swordman from '../base-unit-swordman/Swordman.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

export class Unit extends GoodyHutAction {
  #rulesRegistry;
  #unitRegistry;

  constructor({
    goodyHut,
    rulesRegistry = RulesRegistry.getInstance(),
    unitRegistry = UnitRegistry.getInstance(),
    unit,
  } = {}) {
    super({
      goodyHut,
      unit,
    });

    this.#rulesRegistry = rulesRegistry;
    this.#unitRegistry = unitRegistry;
  }

  perform() {
    const availableUnits = [Horseman, Swordman],
      RandomUnit = availableUnits[Math.floor(availableUnits.length * Math.random())],
      unit = new RandomUnit({
        player: this.unit().player(),
        rulesRegistry: this.#rulesRegistry,
        tile: this.unit().tile(),
      })
    ;

    this.#unitRegistry.register(unit);
  }
}

export default Unit;
