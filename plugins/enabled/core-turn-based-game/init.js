import Time from './Time.js';

['engine:start', 'turn:end']
  .forEach((event) => engine.on(event, () =>
    engine.emit('turn:start', Time.increment())
  ))
;
