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
  improvements = {
    irrigation: {
      food: 1,
    },
    road: {
      trade: 1,
    },
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'oasis',
      title: 'Oasis',
      food: 2,
      improvements: {
        irrigation: {
          food: 2,
        },
      },
      chance: 16,
    },
  ];
  static distribution = [
    {
      from: 0.4,
      to: 0.6,
      coverage: 0.4,
      clustered: true,
      path: false,
    },
  ];
}

export default Desert;

Terrain.register(Desert);
