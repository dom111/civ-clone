import Land from './Land.js';
import Terrain from './Terrain.js';

export class Swamp extends Land {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'swamp';
  title = 'Swamp';
  food = 1;
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
  ];
  static distribution = [
    {
      from: .2,
      to: .4,
      coverage: .025,
      clustered: true,
      path: false,
    },
    {
      from: .6,
      to: .8,
      coverage: .025,
      clustered: true,
      path: false,
    },
  ];
}

export default Swamp;

Terrain.register(Swamp);
