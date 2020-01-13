import Terrain from './Terrain.js';

export class Desert extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'desert';
  title = 'Desert';
  food = 0;
  trade = 0;
  production = 1;
  movementCost = 1;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'oasis',
      title: 'Oasis',
      food: 2,
      chance: .06,
    },
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .4,
      to: .6,
      coverage: .4,
      clustered: true,
      path: false,
    },
  ];
}

export default Desert;

Terrain.register(Desert);
