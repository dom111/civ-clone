import {Land} from '../Types.js';

export class Desert extends Land {
  movementCost = 1;
  special = [
    {
      name: 'oasis',
      title: 'Oasis',
      food: 2,
      chance: .06,
    },
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: .06,
    },
  ];
}

export default Desert;
