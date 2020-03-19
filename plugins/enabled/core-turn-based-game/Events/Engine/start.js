import Turn from '../../Turn.js';

['game:start', 'turn:end']
  .forEach((event) => engine.on(event, () => {
    engine.emit('turn:start', Turn.getInstance()
      .increment()
    );
  }))
;
