let turn = 0;

['start', 'turn:end'].forEach((event) => engine.on(event, () => {
  // TODO: use engine.defineProperty or something.
  engine.turn = ++turn;
  engine.emit('turn:start', turn);
}));
