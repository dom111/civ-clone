import Terrain from './Terrain.js';

export class Jungle extends Terrain {
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
  improvements = {
    road: {},
  };
  size = 16;
  ocean = false;
  land = true;
  impassable = false;
  special = [
    {
      name: 'gems',
      title: 'Gems',
      trade: 3,
      chance: 16,
    },
  ];
  static distribution = [
    {
      from: 0.2,
      to: 0.45,
      coverage: 0.2,
      clustered: true,
      path: false,
    },
    {
      from: 0.55,
      to: 0.8,
      coverage: 0.2,
      clustered: true,
      path: false,
    },
  ];
}

export default Jungle;

Terrain.register(Jungle);
