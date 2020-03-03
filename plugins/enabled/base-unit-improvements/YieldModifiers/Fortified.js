import YieldModifier from '../../core-yields/YieldModifier.js';

export class Fortified extends YieldModifier {
  constructor(priority = 0) {
    super((value) => value, priority);
  }
}

export default Fortified;
