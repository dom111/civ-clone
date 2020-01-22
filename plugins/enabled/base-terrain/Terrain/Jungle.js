import {Land} from '../../core-terrain/Types.js';

export class Jungle extends Land {
  movementCost = 2;
  special = [
    {
      name: 'gems',
      title: 'Gems',
      trade: 3,
      chance: .06,
    },
    {
      name: 'bananas',
      title: 'Bananas',
      food: 3,
      chance: .06,
    },
    {
      name: 'elephant',
      title: 'Elephant',
      food: 2,
      production: 2,
      chance: .03,
    },
  ];
}

export default Jungle;
