import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import goodyHutDiscovered from './Rules/GoodyHut/discovered.js';
import tileGoodyHut from './Rules/Tile/goody-hut.js';
import unitMoved from './Rules/Unit/moved.js';
import worldBuilt from './Rules/World/built.js';

RulesRegistry.getInstance()
  .register(
    ...goodyHutDiscovered(),
    ...tileGoodyHut(),
    ...unitMoved(),
    ...worldBuilt()
  )
;
