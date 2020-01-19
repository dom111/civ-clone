import {Land} from '../Types.js';

export class Swamp extends Land {
  movementCost = 2;
  special = [
    {
      name: 'oil',
      title: 'Oil',
      production: 3,
      chance: .06,
    },
  ];
}

export default Swamp;
