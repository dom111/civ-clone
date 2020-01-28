import {Food, Production} from './Yields.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

[Food, Production]
  .forEach((Yield) => YieldRegistry.register(Yield))
;
