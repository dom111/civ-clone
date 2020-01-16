import Land from './Land.js';
import Terrain from './Terrain.js';

export class Arctic extends Land {
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
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: .06,
    },
    {
      name: 'seal',
      title: 'Seal',
      food: 2,
      production: 1,
      chance: .06,
    },
    {
      name: 'caribou',
      title: 'Caribou',
      food: 1,
      production: 2,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .0,
      to: .02,
      coverage: .8,
      clustered: false,
      path: false,
    },
    {
      from: .02,
      to: .1,
      coverage: .3,
      clustered: true,
      path: false,
    },
    {
      from: .90,
      to: .98,
      coverage: .3,
      clustered: true,
      path: false,
    },
    {
      from: .98,
      to: 1,
      coverage: .8,
      clustered: false,
      path: false,
    },
  ];
}

export default Arctic;

Terrain.register(Arctic);
