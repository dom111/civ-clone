import {Land} from '../Types.js';

export class Grassland extends Land {
  movementCost = 1;
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
