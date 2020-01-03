import Terrain from './Terrain.js';

export class Arctic extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'arctic';
  title = 'Arctic';
  food = 0;
  trade = 0;
  production = 0;
  movementCost = 2;
  improvements = {
    road: {}
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
      chance: 16
    }
  ];
  static distribution = [
    {
      from: 0.0,
      to: 0.02,
      coverage: 0.8,
      clustered: false,
      path: false
    },
    {
      from: 0.02,
      to: 0.1,
      coverage: 0.3,
      clustered: true,
      path: false
    },
    {
      from: 0.90,
      to: 0.98,
      coverage: 0.3,
      clustered: true,
      path: false
    },
    {
      from: 0.98,
      to: 1,
      coverage: 0.8,
      clustered: false,
      path: false
    }
  ];
}

export default Arctic;

Terrain.register(Arctic);
