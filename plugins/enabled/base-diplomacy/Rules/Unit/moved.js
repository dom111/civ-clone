import Contact from '../../../core-diplomacy/Interactions/Contact.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import InteractionRegistry from '../../../core-diplomacy/InteractionRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  interactionRegistry = InteractionRegistry.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:moved:interaction:contact',
    new Criterion((unit) => unit.tile()
      .getNeighbours()
      .forEach((tile) => unitRegistry.getBy('tile', tile)
        .some((tileUnit) => tileUnit.player() !== unit.player())
      )
    ),
    new Effect((unit) => unit.tile()
      .getNeighbours()
      .forEach((tile) => unitRegistry.getBy('tile', tile)
        .filter((tileUnit) => tileUnit.player() !== unit.player())
        .forEach((tileUnit) => interactionRegistry.register(new Contact(unit, tileUnit)))
      )
    )
  ),
];

export default getRules;
