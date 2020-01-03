import Terrain from './Terrain.js';

export class Ocean extends Terrain {
  name = 'ocean';
  title = 'Ocean';
  food = 1;
  trade = 3;
  production = 0;
  movementCost = 1;
  improvements = {};
  size = 16;
  ocean = true;
  land = false;
  impassable = false;
  special = [
    {
      name: 'whale',
      title: 'Whale',
      food: 3,
      trade: 4,
      production: 1,
      chance: 16
    },
    {
      name: 'fish',
      title: 'Fish',
      food: 3,
      trade: 4,
      chance: 20
    }
  ];
}

export default Ocean;

Terrain.register(Ocean);
