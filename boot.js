'use strict';

import Engine from './src/Engine.js';

try {
  (async () => {
    const engine = new Engine();
    await engine.start();
    console.log(engine);
  })()
}
catch (e) {
  throw e;
}
