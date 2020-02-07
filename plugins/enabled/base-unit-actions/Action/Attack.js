import Action from '../../core-unit-actions/Action.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export class Attack extends Action {
  perform() {
    const [tile] = UnitRegistry.getBy('tile',  this.unit.tile),
      tileUnits = UnitRegistry.getBy('tile', this.to)
        .sort((a,b) => b.finalDefence() - a.finalDefence()),
      [defender] = tileUnits
    ;

    console.log(`${this.unit.player.civilization.people} ${this.unit.constructor.name} attacking ${defender.player.civilization.people} ${defender.constructor.name}`);

    if ((this.unit.finalAttack() * Math.random()) >= (defender.finalDefence() * Math.random())) {
      // TODO: fire a defeated event and process based on rules
      if (
        CityRegistry.getBy('tile', tile)
          .length ||
        // TODO: unit tile improvement registry
        tile.improvements.includes('fortress')
      ) {
        defender.destroy(this.unit.player);
      }
      else {
        tileUnits.forEach((tileUnit) => tileUnit.destroy(this.unit.player));
      }

      return;
    }

    this.unit.destroy(defender.player);
  }
}

export default Attack;
