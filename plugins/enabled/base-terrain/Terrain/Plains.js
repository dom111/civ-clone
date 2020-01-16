import {Land} from '../Types.js';
import Terrain from '../Terrain.js';

export class Plains extends Land {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'plains';
  title = 'Plains';
  food = 1;
  trade = 0;
  production = 1;
  movementCost = 1;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'horse',
      title: 'Horse',
      production: 3,
      chance: .06,
    },
  ];
  static distribution = [
    {
      from: .3,
      to: .7,
      coverage: .5,
      clustered: false,
      path: false,
    },
  ];
}

export default Plains;

Terrain.register(Plains);
