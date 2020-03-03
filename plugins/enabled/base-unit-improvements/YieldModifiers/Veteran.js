import YieldModifier from '../../core-yields/YieldModifier.js';

export class Veteran extends YieldModifier {
  constructor(priority = 0) {
    super((value) => value * .5, priority);
  }
}

export default Veteran;
