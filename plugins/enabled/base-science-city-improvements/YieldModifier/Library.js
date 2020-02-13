import {YieldModifier} from '../../core-yields/YieldModifier.js';

export class Library extends YieldModifier {
  constructor(priority = 10) {
    super((value) => value * .5, priority);
  }
}

export default Library;
