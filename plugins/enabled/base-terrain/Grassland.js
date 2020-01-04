import Terrain from './Terrain.js';

export class Grassland extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'grassland';
  title = 'Grassland';
  food = 2;
  trade = 0;
  production = 0;
  improvements = {
    irrigation: {
      food: 1,
    },
    road: {
      trade: 1,
    },
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'grassland-shield',
      title: 'Grassland (Shield)',
      production: 1,
      chance: .4,
    },
    {
      name: 'grassland-cow',
      title: 'Grassland (Cow)',
      food: 3,
      production: 1,
      chance: .05,
    },
  ];
}

export default Grassland;

Terrain.register(Grassland);
