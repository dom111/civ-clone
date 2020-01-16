import Terrain from './Terrain.js';

export class Ocean extends Terrain {
  constructor() {
    super();

    this.applySpecial();
  }

  name = 'ocean';
  title = 'Ocean';
  food = 1;
  trade = 3;
  production = 0;
  movementCost = 1;
  ocean = true;
  impassable = false;
  special = [
    {
      name: 'whale',
      title: 'Whale',
      food: 3,
      production: 1,
      chance: .06,
    },
    {
      name: 'fish',
      title: 'Fish',
      food: 2,
      production: 1,
      chance: .05,
    },
  ];
}

export default Ocean;

Terrain.register(Ocean);
