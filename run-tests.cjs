const glob = require('glob');

// mock the Engine
global.engine = {
  emit: () => {},
  on: () => {},
};

glob('./**/tests/*.test.js', {}, async (error, matches) => {
  await Promise.all(matches.map((match) => import(match)));

  run();
});
