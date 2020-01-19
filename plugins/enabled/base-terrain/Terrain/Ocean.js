import {Ocean as BaseOcean} from '../Types/Ocean.js';

export class Ocean extends BaseOcean {
  movementCost = 1;
  special = [
    {
      name: 'whale',
      title: 'Whale',
      food: 3,
      production: 1,
      chance: .06,
    },
    {
      name: 'fish',
      title: 'Fish',
      food: 2,
      production: 1,
      chance: .05,
    },
  ];
}

export default Ocean;
