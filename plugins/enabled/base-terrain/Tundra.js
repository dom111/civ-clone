import Terrain from './Terrain.js';

export class Tundra extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'tundra';
  title = 'Tundra';
  food = 1;
  trade = 0;
  production = 0;
  movementCost = 1;
  improvements = {
    road: {},
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'seal',
      title: 'Seal',
      food: 2,
      chance: 16,
    },
  ];
  static distribution = [
    {
      from: 0.02,
      to: 0.15,
      coverage: 0.3,
      clustered: true,
      path: false,
    },
    {
      from: 0.85,
      to: 0.98,
      coverage: 0.3,
      clustered: true,
      path: false,
    },
  ];
}

export default Tundra;

Terrain.register(Tundra);
