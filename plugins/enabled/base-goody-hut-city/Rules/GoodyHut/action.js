import {Grassland, Plains, River} from '../../../base-terrain/Terrains.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import FoundCity from '../../FoundCity.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
} = {}) => [
  new Rule(
    'goody-hut:action:city',
    new Criterion((goodyHut) => [Grassland, Plains, River]
      .some((Terrain) => goodyHut.tile().terrain() instanceof Terrain)
    ),
    new Criterion((goodyHut, unit) => goodyHut.tile()
      .getSurroundingArea()
      .score({
        player: unit.player(),
      }) >= 150
    ),
    new Criterion((goodyHut) => goodyHut.tile()
      .getSurroundingArea(4)
      .every((tile) => cityRegistry.getBy('tile', tile)
        .length === 0
      )
    ),
    new Effect((goodyHut, unit) => new FoundCity({
      goodyHut,
      unit,
    }))
  ),
];

export default getRules;
