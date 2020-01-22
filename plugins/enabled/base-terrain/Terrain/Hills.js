import {Land} from '../../core-terrain/Types.js';

export class Hills extends Land {
  movementCost = 2;
  special = [
    {
      name: 'coal',
      title: 'Coal',
      production: 2,
      chance: .06,
    },
    {
      name: 'iron',
      title: 'Iron',
      production: 1,
      trade: 1,
      chance: .06,
    },
  ];
}

export default Hills;
