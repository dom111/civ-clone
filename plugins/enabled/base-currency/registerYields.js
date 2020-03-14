import {Gold} from './Yields.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

YieldRegistry.getInstance()
  .register(Gold)
;