import {Land} from '../../core-terrain/Types.js';

export class Arctic extends Land {
  movementCost = 2;
  special = [
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: .06,
    },
    {
      name: 'caribou',
      title: 'Caribou',
      food: 1,
      production: 2,
      chance: .06,
    },
  ];
}

export default Arctic;