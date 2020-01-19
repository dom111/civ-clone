import {Land} from '../Types.js';

export class Tundra extends Land {
  movementCost = 1;
  special = [
    {
      name: 'seal',
      title: 'Seal',
      food: 2,
      chance: .06,
    },
  ];
}

export default Tundra;
