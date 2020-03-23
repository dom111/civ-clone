import Registry from '../core-registry/Registry.js';
import TransportManifest from './TransportManifest.js';

export class TransportRegistry extends Registry {
  constructor() {
    super(TransportManifest);
  }
}

export default TransportRegistry;
