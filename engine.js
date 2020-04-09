import Engine from './src/Engine.js';
import process from "process";

const engine = new Engine();

// TODO: check this actually works...
process.argv.slice(process.argv.indexOf('--') + 1)
  .forEach((arg) => {
    const [key, value] = arg.replace(/^--/, '')
      .split(/=/, 2)
    ;

    engine.setOption(key, arg.match(/=/) ? value : ! arg.match(/^--no-/));
  })
;

// This helps track down unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error(error.stack);
});

engine.on('game:exit', () => process.exit());

engine.start();
