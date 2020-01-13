import Terrain from './Terrain.js';

export class River extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'river';
  title = 'River';
  food = 2;
  trade = 1;
  production = 0;
  movementCost = 1;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'shield',
      title: 'Shield',
      production: 1,
      chance: .4,
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

export default River;

Terrain.register(River);
