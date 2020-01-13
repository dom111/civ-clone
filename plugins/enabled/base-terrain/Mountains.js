import Terrain from './Terrain.js';

export class Mountains extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'mountains';
  title = 'Mountains';
  food = 0;
  trade = 0;
  production = 1;
  movementCost = 3;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'gold',
      title: 'Gold',
      trade: 5,
      chance: .06,
    },
    {
      name: 'iron',
      title: 'Iron',
      production: 3,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .1,
      to: .9,
      coverage: .05,
      clustered: false,
      path: true,
    },
  ];
}

export default Mountains;

Terrain.register(Mountains);
