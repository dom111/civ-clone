/**
* @file base-science core file, defines the core namespace, extends the
*     {engine.Player} object and binds events.
* @module {engine.Science}
* @author Dom Hastings
*/
'use strict';

// TODO: inject dependencies
if ('Player' in engine) {
  /**
   * Add necessary methods to all `Player` objects
   * @namespace {engine.Player}
   */
  Object.defineProperties(engine.Player.prototype, {
    /**
     * Sets the {engine.Player}'s current research project to the
     *     advance specified.
     * @param {engine.Science.Advance} advance
     * @extends {engine.Player}
     */
    setResearch(advance) {
      if (typeof advance === 'string') {
        this.getAvailableResearch().filter((availableAdvance) => {
          if (availableAdvance.name === advance) {
            advance = availableAdvance;
          }
        });

        // if we haven't resolved to an object, we have a problem...
        if (typeof advance === 'string') {
          throw `Invalid advance '${advance}'.`;
        }
      }

      if (! (advance.data.requires) || advance.data.requires.all(
        (advance) => player.advances.map(
          (advance) => advance.data.name).includes(
          advance))) {
        this.researching = {
          ...advance,
          cost: this.getResearchCost(advance)
        };

        return true;
      }
      else {
        return false;
      }
    },

    /**
     * @param {engine.Advance} advance
     * @return {Number}
     */
    getResearchCost(advance) {
      /** @todo update cost based on difficulty/game length */
      return advance.cost;
    },

    /**
     * Filters all available advances based on `player`s currently known
     *     advances.
     * @return {Array}
     */
    getAvailableResearch() {
      const player = this;

      return Object.keys(engine.Science.advances).map(
        (advance) => engine.Science.get(advance)).filter((advance) => {
        return advance.data.requires.every(
          (advance) => player.advances.map(
            (advance) => advance.data.name).includes(advance));
      }).sort(
        (a, b) => a.data.cost > b.data.cost ? 1 :
          a.data.cost == b.data.cost ? 0 : -1);
    },

    /**
     * Loads the research-selector template, add it to the DOM and binds
     *     events to carry out actions.
     * @todo prevent turn end if this needs to be actioned
     */
    displayTechChooser() {
      const filter = {
        package: 'base-science',
        type: 'template',
        label: 'research-selector'
      };

      renderer.addToBody(engine.template(engine.getAsset(filter), {
        availableResearch: this.getAvailableResearch()
      }));
    }
  });
}
else {
  /** @todo notification that Player wasn't updated?? */
}

// Add 'science' property to all City objects
if ('City' in engine) {
  /**
   * Add necessary methods to all `City` objects
   * @namespace {engine.City}
   */
  engine.City.prototype.__defineGetter__('science', function() {
    /** @todo library multiplier, etc */
    this.calculateRates();

    return this.rates.science;
  });
}
else {
  /** @todo notification that City wasn't updated?? */
}

if (! ('availableTradeRates' in engine)) {
  engine.availableTradeRates = [];
}

/** Add `science` rate to the current {Engine} instance */
engine.availableTradeRates.push('science'); // add science as a trade-rate

/** Load and execute all the `advance` plugins. */
// TODO: delay this...
engine.on('start', () => engine.loadPlugins('advance'));
//
//

/**
 * When a player is added, initialise the science related properties.
 * @event Engine#player-added
 */
engine.on('player-added', (player) => {
  player.science = 0;
  player.researching = false;
  player.advances = [];
});

/**
 * When a player's turn starts, iterate around the players cities, adding
 *     the accumulated science values and
 * @event Engine#player-turn-start
 * @fires Engine#notification
 */
engine.on('player-turn-start', (player) => {
  player.cities.forEach((city) => {
    player.science += city.science;

    if (player.science >= player.researching.cost) {
      engine.emit('player-science-research-complete', player.reserching, player);
    }
  });
});

engine.on('player-science-research-complete', (player) => {
  engine.emit('notification', {
    name: 'research_complete',
    type: 'research',
    message: t.research_complete.replace(
      /::title::/,
      player.researching.title),
    advance: player.researching,
    click(notification) {
      notification.player.displayTechChooser();
    }
  });

  player.science -= player.researching.cost;
  player.advances.push(new player.researching());
  player.researching = false;
});

engine.on('player-science-research-started', (player, advance) => {
  player.researching = advance;
});

engine.on('city-created', (city) => {
  const {player} = city;

  if (player.cities.length === 1) {
    city.capital = false;

    if (! player.researching) {
      engine.emit('notification', {
        name: 'choose_research',
        type: 'research',
        message: t.choose_reserch,
        player: player,
        click(notification) {
          notification.player.displayTechChooser();
        },
        when(notification) {
          return notification.player.getRate('science') > 0;
        }
      });
    }
  }
  else {
    city.capital = false;
  }
});
