import Time from './Time.js';

['engine:start', 'turn:end'].forEach((event) => engine.on(event, () => {
  engine.emit('turn:start', Time.increment());
}));
//
// engine.on('engine:start', () => engine.emit('turn:start', Time));
// engine.on('turn:end', () => engine.emit('turn:start', Time.increment()));