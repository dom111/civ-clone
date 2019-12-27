import Notifications from 'base-notifications/Notifications.js';

engine.on('start', () => {
  // TODO: controlled by options
  engine.turn = 0;
  engine.year = -4000;
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
    increment: 1
  }
];

engine.on('turn-end', () => {
  engine.turn++;

  engine.year += ranges.filter((range) => {
    return ('year' in range) ? engine.year < range.year : true;
  })[0].increment;
});

engine.on('turn-start', () => {
  Notifications.add({
    name: 'date',
    message: engine.year,
    year: engine.year
  });
});
