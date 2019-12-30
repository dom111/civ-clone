'use strict';

import Engine from './src/Engine.js';

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.stack);
});



(async () => {
  try {
    const engine = new Engine();
    await engine.start()
      .catch((err) => console.error(err))
    ;
    console.log('engine started');
  }
  catch (e) {
    throw e;
  }
})();
