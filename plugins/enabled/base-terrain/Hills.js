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
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'coal',
      title: 'Coal',
      production: 2,
      chance: .06,
    },
    {
      name: 'iron',
      title: 'Iron',
      production: 1,
      trade: 1,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .1,
      to: .9,
      coverage: .08,
      clustered: true,
      path: true,
    },
  ];
}

export default Hills;

Terrain.register(Hills);
