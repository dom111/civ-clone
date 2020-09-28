import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
  // engine = engine,
} = {}) => [
  new Rule(
    'city:captured:shrink',
    new Effect((capturedCity) => capturedCity.shrink())
  ),
  new Rule(
    'city:captured:event',
    new Effect((capturedCity, player) => engine.emit('city:captured', capturedCity, player))
  ),
  new Rule(
    'city:captured:destroy-units',
    new Effect((capturedCity) => unitRegistry.getBy('city', capturedCity)
      .forEach((unit) => unit.destroy())
    )
  ),
  new Rule(
    'city:captured:destroy-units',
    new Effect((capturedCity) => unitRegistry.getBy('city', capturedCity)
      .forEach((unit) => unit.destroy())
    )
  ),
  new Rule(
    'city:captured:check-player-status',
    // TODO: have some `Rule`s that just call `Player#defeated` or something?
    new Criterion((capturedCity) => cityRegistry.getBy('player', capturedCity.player()).length === 0),
    new Effect((capturedCity) => engine.emit('player:defeated', capturedCity.player()))
  ),
];

export default getRules;
