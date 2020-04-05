import DelayedAction from './DelayedAction.js';
import TileImprovementRegistry from '../../core-registry/Registry.js';

export class Fortify extends DelayedAction {
  perform() {
    super.perform({
      name: 'pillage',
      action: ({
        tileImprovementRegistry = TileImprovementRegistry.getInstance(),
      } = {}) => {
        // TODO: should this prioritise Fortress > Mine > Irrigation > Railroad > Road?
        const [improvement] = tileImprovementRegistry.getBy('tile', this.from());

        tileImprovementRegistry.unregister(improvement);
      },
      turns: 1,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default Fortify;
