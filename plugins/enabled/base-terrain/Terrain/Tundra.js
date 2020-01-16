import {Land} from '../Types.js';
import Terrain from '../Terrain.js';

export class Tundra extends Land {
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
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'seal',
      title: 'Seal',
      food: 2,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .02,
      to: .15,
      coverage: .3,
      clustered: true,
      path: false,
    },
    {
      from: .85,
      to: .98,
      coverage: .3,
      clustered: true,
      path: false,
    },
  ];
}

export default Tundra;

Terrain.register(Tundra);
