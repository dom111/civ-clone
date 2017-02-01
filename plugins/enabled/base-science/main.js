Game.availableTradeRates.push('science'); // add tax as a trade-rate

// global
const _loadAdvances = function() {
    Plugin.get('advances').forEach(function(pack) {
        pack.contents.forEach(function(file) {
            Game.advances.push(Game.loadJSON(file));
        });
    });
};

extend(Player.prototype, {
    science: 0,
    researching: false,
    advances: [],
    setResearch: function(advance) {
        if (typeof advance === 'string') {
            this.getAvailableResearch().filter(function(availableAdvance) {
                if (availableAdvance.name === advance) {
                    advance = availableAdvance;
                }
            });

            if (typeof advance === 'string') {
                throw `Invalid advance '${advance}'.`;
            }
        }

        this.researching = extend({}, advance, {
            // TODO: set time based on difficulty/game length
            cost: advance.baseCost
        });
    },
    getAvailableResearch: function() {
        var player = this;

        return Game.advances.filter(function(advance) {
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

    }
});

// City.prototype
City.prototype.__defineGetter__('science', function() {
    // TODO: library multiplier
    this.calculateRates();

    return this.rates.science;
});

Game.advances = [];

Game.on('start', function() {
    _loadAdvances();

    Game.on('city-created', function(city) {
        var player = city.player;

        city.on('turn-end', function() {
            player.science += this.science;

            if (player.science >= player.researching.cost) {
                Events.add({
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

        if (player.cities.length === 1) {
            if (!player.researching) {
                Events.add({
                    name: 'choose_research',
                    player: player,
                    click: function() {
                        player.displayTechChooser();
                    },
                    when: function() {
                        return this.player.getRate('science') > 0
                    }
                });
            }
        }
        else {
            city.capital = false;
        }
    });
});
