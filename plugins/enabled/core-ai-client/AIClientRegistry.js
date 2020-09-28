import AIClient from './AIClient.js';
import Registry from '../core-registry/Registry.js';

export class AIClientRegistry extends Registry {
  constructor() {
    super(AIClient);
  }
}

export default AIClientRegistry;
