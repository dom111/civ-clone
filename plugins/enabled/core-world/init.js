import World from './World.js';

engine.on('engine:build', () => engine.emit('world:built', new World()));
