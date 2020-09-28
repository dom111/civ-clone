import BaseGenerator from './BaseGenerator.js';
import WorldGeneratorRegistry from '../core-world-generator/WorldGeneratorRegistry.js';

WorldGeneratorRegistry.getInstance()
  .register(BaseGenerator)
;
