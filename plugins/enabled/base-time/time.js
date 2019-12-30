let year = null;

engine.on('start', () => {
  year = engine.option('start-year', -4000);
});

const ranges = [
  {
    year: 1000,
    increment: 20
  },
  {
    year: 1500,
    increment: 10
  },
  {
    year: 1750,
    increment: 5
  },
  {
    year: 1850,
    increment: 2
  },
  {
    year: Infinity,
    increment: 1
  }
];

engine.on('turn:end', () => {
  const [detail] = ranges.filter((range) => engine.year < range.year);

  year += detail.increment;
  engine.emit('time:year-updated', year);
});
