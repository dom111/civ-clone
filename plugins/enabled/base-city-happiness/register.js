import {Happiness, Unhappiness} from './Yields.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

[
  Happiness,
  Unhappiness,
]
  .forEach((Entity) => YieldRegistry.register(Entity))
;
