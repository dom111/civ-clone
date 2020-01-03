import Time from './Time.js';

['start', 'turn:end'].forEach((event) => engine.on(event, () => {
  engine.emit('turn:start', Time.increment());
}));
//
// engine.on('start', () => engine.emit('turn:start', Time));
// engine.on('turn:end', () => engine.emit('turn:start', Time.increment()));