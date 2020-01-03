import Engine from './src/Engine.js';

// This helps track down unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error(error.stack);
});

// global.debug = true;

(async () => {
  const engine = new Engine();

  await engine.start();
})();
