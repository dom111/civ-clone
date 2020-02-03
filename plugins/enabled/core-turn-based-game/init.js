import Time from './Time.js';

['game:start', 'turn:end']
  .forEach((event) => engine.on(event, () =>
    engine.emit('turn:start', Time.increment())
  ))
;
