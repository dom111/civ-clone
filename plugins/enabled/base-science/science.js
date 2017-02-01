// Add necessary properties to all 'Player' objects
extend(engine.Player, {
    setResearch: (advance) => {
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

        // TODO: validate we can research this advance

        this.researching = extend({}, advance, {
            cost: this.getResearchCost(advance)
        });
    },
    // TODO: set time based on difficulty/game length
    getResearchCost: (advance) => advance.baseCost,
    getAvailableResearch: () => {
        var player = this;

        return engine.advances.filter((advance) => {
            return !player.advances.some((acquiredAdvance) => {
                return acquiredAdvance.name === advance.name;
            });
        }).filter((advance) => {
            return (advance.requires || []).every((requirement) => {
                return player.advances.some((got) => {
                    return got.name === requirement
                });
            });
        }).sort((a, b) => {
            return (a.baseCost > b.baseCost) ?
                1 : (a.baseCost === b.baseCost) ?
                (((a.requires || []).length > (b.requires || []).length) ?
                    1 :
                    ((a.requires || []).length === (b.requires || []).length) ?
                    0 :
                    -1) :
                -1;
        });
    },
    displayTechChooser: () => console.log(this.getAvailableResearch())
});

// Add 'science' property to all City objects
engine.City.prototype.__defineGetter__('science', function() {
    // TODO: library multiplier
    this.calculateRates();

    return this.rates.science;
});

// game properties and events
engine.availableTradeRates.push('science'); // add tax as a trade-rate
engine.advances = [];

engine.on('start', () => {
    Engine.Plugin.get('advances').forEach((pack) => {
        pack.contents.forEach((file) => {
            engine.advances.push(engine.loadJSON(file));
        });
    });
});

engine.on('player-added', (player) => {
    player.science = 0;
    player.researching = false;
    player.advances = [];
});

engine.on('player-turn-start', (player) => {
    player.cities.forEach((city) => {
        player.science += city.science;

        if (player.science >= player.researching.cost) {
            emgine.Notifications.add({
                name: 'research_complete',
                message: 'Research of ' + player.researching.title + ' complete!',
                advance: player.researching,
                click: () => player.displayTechChooser()
            });

            player.science -= player.researching.cost;
            player.advances.push(player.researching);
            player.researching = false;
        }
    });
});

engine.on('city-created', (city) => {
    var player = city.player;

    if (player.cities.length === 1) {
        city.capital = false;

        if (!player.researching) {
            engine.Notifications.add({
                name: 'choose_research',
                message: 'Choose a research project.',
                click: () => player.displayTechChooser(),
                when: () => player.getRate('science') > 0
            });
        }
    }
    else {
        city.capital = false;
    }
});
