import Terrain from './Terrain.js';

export class Swamp extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'swamp';
  title = 'Swamp';
  food = 1;
  trade = 0;
  production = 0;
  movementCost = 2;
  improvements = {
    road: {},
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: 16,
    },
  ];
  static distribution = [
    {
      from: 0.2,
      to: 0.4,
      coverage: 0.05,
      clustered: true,
      path: false,
    },
    {
      from: 0.6,
      to: 0.8,
      coverage: 0.05,
      clustered: true,
      path: false,
    },
  ];
}

export default Swamp;

Terrain.register(Swamp);
