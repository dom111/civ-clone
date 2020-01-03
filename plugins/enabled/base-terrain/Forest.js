import Terrain from './Terrain.js';

export class Forest extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'forest';
  title = 'Forest';
  food = 1;
  trade = 0;
  production = 3;
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
      name: 'horse',
      title: 'Horse',
      food: 3,
      chance: 16
    }
  ];
  static distribution = [
    {
      from: 0.05,
      to: 0.2,
      coverage: 0.15,
      clustered: false,
      path: false
    },
    {
      from: 0.2,
      to: 0.4,
      coverage: 0.2,
      clustered: true,
      path: false
    },
    {
      from: 0.6,
      to: 0.8,
      coverage: 0.2,
      clustered: true,
      path: false
    },
    {
      from: 0.8,
      to: 0.95,
      coverage: 0.15,
      clustered: false,
      path: false
    }
  ];
}

export default Forest;

Terrain.register(Forest);
