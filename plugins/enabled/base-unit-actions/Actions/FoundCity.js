import Action from '../../core-unit-actions/Action.js';
import City from '../../core-city/City.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class FoundCity extends Action {
  perform() {
    new City({
      player: this.unit.player,
      tile: this.unit.tile,
      // TODO: no.
      name: this.unit.player.civilization.cityNames.shift(),
    });

    this.unit.destroy();

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default FoundCity;
