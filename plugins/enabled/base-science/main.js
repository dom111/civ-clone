// Add necessary properties to all 'Player' objects
Player.extend({
    setResearch: function(advance) {
        if (typeof advance === 'string') {
            this.getAvailableResearch().filter(function(availableAdvance) {
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
    getResearchCost: function(advance) {
        // TODO: set time based on difficulty/game length
        return advance.baseCost;
    },
    getAvailableResearch: function() {
        var player = this;

        return game.advances.filter(function(advance) {
            return !player.advances.some(function(acquiredAdvance) {
                return acquiredAdvance.name === advance.name;
            });
        }).filter(function(advance) {
            return (advance.requires || []).map(function(requirement) {
                return player.advances.some(function(got) {
                    return got.name === requirement
                });
            }).every(function(value) {
                return value === true
            });
        }).sort(function(a, b) {
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
    displayTechChooser: function() {
        console.log(this.getAvailableResearch())
    }
});

// Add 'science' property to all City objects
City.prototype.__defineGetter__('science', function() {
    // TODO: library multiplier
    this.calculateRates();

    return this.rates.science;
});

// game properties and events
game.availableTradeRates.push('science'); // add tax as a trade-rate
game.advances = [];

game.on('start', function() {
    Plugin.get('advances').forEach(function(pack) {
        pack.contents.forEach(function(file) {
            game.advances.push(game.loadJSON(file));
        });
    });
});

game.on('player-added', function(player) {
    player.science = 0;
    player.researching = false;
    player.advances = [];
});

game.on('turn-end', function() {
    game.players.forEach(function(player) {
        player.cities.forEach(function(city) {
            player.science += city.science;

            if (player.science >= player.researching.cost) {
                Notifications.add({
                    name: 'research_complete',
                    advance: player.researching,
                    player: player,
                    click: function() {
                        player.displayTechChooser();
                    }
                });

                player.science -= player.researching.cost;
                player.advances.push(player.researching);
                player.researching = false;
            }
        });
    });
});

game.on('city-created', function(city) {
    var player = city.player;

    if (player.cities.length === 1) {
        city.capital = false;

        if (!player.researching) {
            Notifications.add({
                name: 'choose_research',
                player: player,
                click: function() {
                    player.displayTechChooser();
                },
                when: function() {
                    return this.player.getRate('science') > 0;
                }
            });
        }
    }
    else {
        city.capital = false;
    }
});
