import Engine from './src/Engine.js';
import process from 'process';

// This helps track down unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error(error.stack);
});

(async () => {
  const engine = new Engine();

  process.argv.slice(process.argv.indexOf('--') + 1)
    .forEach((arg) => {
      const [key, value] = arg.replace(/^--/, '')
        .split(/=/, 2)
      ;

      engine.setOption(key, value);
    })
  ;

  await engine.start();
})();
