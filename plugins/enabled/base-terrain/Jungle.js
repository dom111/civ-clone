import Land from './Land.js';
import Terrain from './Terrain.js';

export class Jungle extends Land {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'jungle';
  title = 'Jungle';
  food = 1;
  trade = 0;
  production = 0;
  movementCost = 2;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'gems',
      title: 'Gems',
      trade: 3,
      chance: .06,
    },
    {
      name: 'bananas',
      title: 'Bananas',
      food: 3,
      chance: .06,
    },
    {
      name: 'elephant',
      title: 'Elephant',
      food: 2,
      production: 2,
      chance: .03,
    },
  ];
  static distribution = [
    {
      from: .2,
      to: .45,
      coverage: .3,
      clustered: true,
      path: false,
    },
    {
      from: .55,
      to: .8,
      coverage: .3,
      clustered: true,
      path: false,
    },
  ];
}

export default Jungle;

Terrain.register(Jungle);
