import {Happiness, Unhappiness} from './Yields.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

YieldRegistry.getInstance()
  .register(
    Happiness,
    Unhappiness
  )
;
