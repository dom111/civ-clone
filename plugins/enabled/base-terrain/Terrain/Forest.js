import {Land} from '../../core-terrain/Types.js';

export class Forest extends Land {
  movementCost = 2;
  special = [
    {
      name: 'horse',
      title: 'Horse',
      food: 3,
      production: 3,
      chance: .06,
    },
    {
      name: 'deer',
      title: 'Deer',
      food: 4,
      chance: .06,
    },
  ];
}

export default Forest;
