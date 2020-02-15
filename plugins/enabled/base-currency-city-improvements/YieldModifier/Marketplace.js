import {YieldModifier} from '../../core-yields/YieldModifier.js';

export class Marketplace extends YieldModifier {
  constructor(priority = 10) {
    super((value) => value * .5, priority);
  }
}

export default Marketplace;
