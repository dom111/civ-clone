/**
 * @file Advance base class definition. Part of base-science module.
 * @module {engine.Science}
 * @author Dom Hastings
 */
(() => {
  'use strict';

  if (! engine || ! engine.Science) {
    throw Error('Something went badly wrong with base-science');
  }
  /**
     * @namespace engine.Science.Advance
     */
  Object.defineProperties(engine.Science, {
    /**
         * Base Advance class extended by all technological advances in the
         *     base-science module.
         */
    Advance: class Advance {
      /**
             * Creates the instance of the advance and updates the `player`'s
             *     `advances` array with an instance of the
             *     {engine.Science.Advance}.
             * @param {engine.Player} player 
             * @fires player-advance-discovered
             */
      constructor(player) {
        const advance = this;

        player.advances.push(advance);

        Object.defineProperties(advance, {
          player: player
        }, advance.constructor.data);

        advance.discovered();
        engine.emit('player-advance-discovered', advance, player);
      }

      /**
             * Called in the constructer in case any effects need to occur when
             *     it's"discovered" to save overwriting the constructor method
             *     directly. There's also an event `player-advance-discovered`
             *     which is passed the `advance` and the `player` as args.
             * @func discovered
             */
      discovered() {}

      /**
             * Method to return the {engine.Science.Advance} class object based
             *     on its `name` property.
             * @func get
             * @static
             */
      static get(advance) {
        return game.Science.advances[advance];
      }
    },

    /**
         * @property advances
         * @description A plain object that will be updated as new `advance` 
         *     plugins are loaded. This is used by {engine.Player} via methods
         *     added in the `base-science/science.js` `script` component.
         */
    advances: {}
  });
})();
