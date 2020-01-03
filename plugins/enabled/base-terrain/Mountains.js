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
  improvements = {
    mine: {
      production: 1
    },
    road: {}
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'gold',
      title: 'Gold',
      trade: 5,
      chance: 16
    }
  ];
  static distribution = [
    {
      from: 0.1,
      to: 0.9,
      coverage: 0.05,
      clustered: false,
      path: true
    }
  ];
}

export default Mountains;

Terrain.register(Mountains);
