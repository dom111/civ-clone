import Terrain from './Terrain.js';

export class Hills extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'hills';
  title = 'Hills';
  food = 1;
  trade = 0;
  production = 0;
  movementCost = 2;
  improvements = {
    mine: {
      production: 3
    },
    road: {}
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'coal',
      title: 'Coal',
      production: 2,
      chance: 16
    }
  ];
  static distribution = [
    {
      from: 0.1,
      to: 0.9,
      coverage: 0.08,
      clustered: false,
      path: true
    }
  ];
}

export default Hills;

Terrain.register(Hills);
