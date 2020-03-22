import Action from '../../core-unit/Action.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export class Attack extends Action {
  perform() {
    const [tile] = UnitRegistry.getInstance()
        .getBy('tile', this.unit().tile()),
      tileUnits = UnitRegistry.getInstance()
        .getBy('tile', this.to())
        .sort((a, b) => b.defence().value() -
          a.defence().value()
        ),
      [defender] = tileUnits
    ;

    if ((this.unit().attack() * Math.random()) >= (defender.defence() * Math.random())) {
      this.unit().destroy(defender.player());

      return;
    }

    // TODO: fire a defeated event and process based on rules
    if (
      CityRegistry.getInstance()
        .getBy('tile', tile)
        .length ||
      // TODO: unit tile improvement registry
      TileImprovementRegistry.getInstance()
        .getBy('tile', tile).includes('fortress')
    ) {
      defender.destroy(this.unit().player());
    }
    else {
      tileUnits.forEach((tileUnit) => tileUnit.destroy(this.unit().player()));
    }
  }
}

export default Attack;
