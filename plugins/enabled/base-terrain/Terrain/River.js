import {Land} from '../Types.js';

export class River extends Land {
  movementCost = 1;
  special = [
    {
      name: 'shield',
      title: 'Shield',
      production: 1,
      chance: .4,
    },
  ];
}

export default River;
