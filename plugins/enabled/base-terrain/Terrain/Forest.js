import {Land} from '../Types.js';
import Terrain from '../Terrain.js';

export class Forest extends Land {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'forest';
  title = 'Forest';
  food = 1;
  trade = 0;
  production = 2;
  movementCost = 2;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'horse',
      title: 'Horse',
      food: 3,
      production: 3,
      chance: .06,
    },
    {
      name: 'deer',
      title: 'Deer',
      food: 4,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .05,
      to: .2,
      coverage: .15,
      clustered: false,
      path: false,
    },
    {
      from: .2,
      to: .4,
      coverage: .2,
      clustered: true,
      path: true,
    },
    {
      from: .4,
      to: .6,
      coverage: .08,
      clustered: true,
      path: false,
    },
    {
      from: .6,
      to: .8,
      coverage: .2,
      clustered: true,
      path: true,
    },
    {
      from: .8,
      to: .95,
      coverage: .15,
      clustered: false,
      path: false,
    },
  ];
}

export default Forest;

Terrain.register(Forest);
