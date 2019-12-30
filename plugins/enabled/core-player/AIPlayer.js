import Player from './Player.js';
import Settlers from 'base-unit/Settlers.js';

export class AIPlayer extends Player {
  // TODO: basic AI implementation, or at least methods to be called from another AI implementation
  chooseCivilization(choices) {
    const Random = choices[parseInt(choices.length * Math.random(), 10)];

    console.log(choices);
    console.log(Random);
    this.civilization = new Random();

    return this.civilization;
  }

  takeTurn() {
    return promiseFactory((resolve) => {
      console.log(this);

      while (this.activeUnit) {
        const unit = this.activeUnit;

        console.log(unit);

        if (unit instanceof Settlers) {
          unit.buildCity();
        }
      }

      resolve();
    });
  }
}

export default AIPlayer;
