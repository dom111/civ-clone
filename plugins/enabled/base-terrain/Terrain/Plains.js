import {Land} from '../../core-terrain/Types.js';

export class Plains extends Land {
  movementCost = 1;
  special = [
    {
      name: 'horse',
      title: 'Horse',
      production: 3,
      chance: .06,
    },
  ];
}

export default Plains;
