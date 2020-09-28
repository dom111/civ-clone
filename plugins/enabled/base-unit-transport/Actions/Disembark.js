import Move from '../../base-unit/Actions/Move.js';
import TransportRegistry from '../TransportRegistry.js';

export class Disembark extends Move {
  /**
   * @param transportRegistry {TransportRegistry}
   */
  perform({
    transportRegistry = TransportRegistry.getInstance(),
  }) {
    if (! super.perform()) {
      return;
    }

    this.unit()
      .moves()
      .set(0)
    ;

    transportRegistry.getBy('unit', this.unit())
      .forEach((manifest) => manifest.transport()
        .unload(this.unit())
      )
    ;
  }
}

export default Disembark;
