import Advance from './Advance.js';
import Registry from '../core-registry/Registry.js';

export class AdvanceRegistry extends Registry {
  constructor() {
    super(Advance);
  }
}

export default AdvanceRegistry;