import Land from './Land.js';
import Terrain from './Terrain.js';

export class Grassland extends Land {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'grassland';
  title = 'Grassland';
  food = 2;
  trade = 0;
  production = 0;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'grassland-shield',
      title: 'Grassland (Shield)',
      production: 1,
      chance: .33,
    },
    {
      name: 'grassland-cow',
      title: 'Grassland (Cow)',
      food: 3,
      production: 1,
      chance: .06,
    },
  ];
}

export default Grassland;

Terrain.register(Grassland);
