import Terrain from './Terrain.js';

class Grassland extends Terrain {
  name = 'grassland';
  title = 'Grassland';
  food = 2;
  trade = 0;
  production = 0;
  movementCost = 1;
  improvements = {
    irrigation: {
      food: 1
    },
    road: {
      trade: 1
    }
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'shield',
      title: 'Shield',
      production: 1,
      chance: 40
    },
    {
      name: 'cow',
      title: 'Cow',
      food: 3,
      production: 1,
      chance: 5
    }
  ];
}

export default Grassland;