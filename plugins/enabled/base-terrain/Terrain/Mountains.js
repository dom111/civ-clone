import {Land} from '../Types.js';

export class Mountains extends Land {
  movementCost = 3;
  special = [
    {
      name: 'gold',
      title: 'Gold',
      trade: 5,
      chance: .06,
    },
    {
      name: 'iron',
      title: 'Iron',
      production: 3,
      chance: .06,
    },
  ];
}

export default Mountains;
