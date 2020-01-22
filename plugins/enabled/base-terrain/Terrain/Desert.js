import {Land} from '../../core-terrain/Types.js';

export class Desert extends Land {
  movementCost = 1;
  special = [
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: .06,
    },
  ];
}

export default Desert;
