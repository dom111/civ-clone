import Terrain from './Terrain.js';

export class Plains extends Terrain {
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
      name: 'horse',
      title: 'Horse',
      production: 3,
      chance: 16
    }
  ];
  static distribution = [
    {
      from: 0.3,
      to: 0.7,
      coverage: 0.5,
      clustered: false,
      path: false
    }
  ];
}

export default Plains;

Terrain.register(Plains);
