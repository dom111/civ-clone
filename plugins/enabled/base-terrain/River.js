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
  improvements = {
    irrigation: {
      food: 1,
    },
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'shield',
      title: 'Shield',
      production: 1,
      chance: 40,
    },
  ];
  static distribution = [
    {
      from: 0.1,
      to: 0.9,
      coverage: 0.05,
      clustered: false,
      path: true,
    },
  ];
}

export default River;

Terrain.register(River);
