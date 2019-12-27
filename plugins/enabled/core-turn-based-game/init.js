engine.on('build', () => {
  engine.on('start', () => engine.emit('turn-start'));

  engine.on('turn-end', () => engine.emit('turn-start'));
});
