import Action from '../../core-unit-actions/Action.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export class Attack extends Action {
  perform() {
    const [tile] = UnitRegistry.getBy('tile',  this.unit.tile),
      tileUnits = UnitRegistry.getBy('tile', this.to)
        .sort((a,b) => b.finalDefence() - a.finalDefence()),
      [defender] = tileUnits
    ;

    if ((this.unit.finalAttack() * Math.random()) >= (defender.finalDefence() * Math.random())) {
      this.unit.destroy(defender.player);

      return;
    }

    // TODO: fire a defeated event and process based on rules
    if (
      CityRegistry.getBy('tile', tile)
        .length ||
      // TODO: unit tile improvement registry
      TileImprovementRegistry.getBy('tile', tile).includes('fortress')
    ) {
      defender.destroy(this.unit.player);
    }
    else {
      tileUnits.forEach((tileUnit) => tileUnit.destroy(this.unit.player));
    }

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default Attack;
