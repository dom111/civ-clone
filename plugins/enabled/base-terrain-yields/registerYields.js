import * as Yields from './Yields.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

YieldRegistry.getInstance()
  .register(...Object.values(Yields))
;
