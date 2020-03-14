import Registry from '../core-registry/Registry.js';
import Yield from './Yield.js';

export class YieldRegistry extends Registry {
  constructor() {
    super(Yield);
  }
}

export default YieldRegistry;