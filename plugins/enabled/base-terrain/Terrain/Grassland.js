import {Land} from '../../core-terrain/Types.js';

export class Grassland extends Land {
  movementCost = 1;
  special = [
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
