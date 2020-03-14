import {Food, Production} from './Yields.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

YieldRegistry.getInstance()
  .register(Food, Production)
;
