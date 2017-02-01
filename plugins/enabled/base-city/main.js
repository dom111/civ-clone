'use strict';

// bind events - could be in a static method of City?
engine.on('turn-end', function() {
    engine.players.forEach(function(player) {
        player.cities.forEach(function(city) {
            city.foodStorage += city.surplusFood;

            if (city.foodStorage >= ((city.size * 10) + 10)) {
                city.size++;
                city.foodStorage = 0;

                engine.emit('city-grow', city);
            }

            city.building.progress += city.production;

            if (city.building.progress >= city.building.cost) {
                if (city.building.unit) {
                    new engine.Unit({
                        tile: city.tile,
                        player: city.player,
                        unit: city.building.unit,
                        city: city
                    });

                    city.building = false;
                }
                else if (city.building.improvement) {
                    new engine.Improvement({
                        city: city
                    });

                    city.building = false;
                }
                else {
                    // city.building.action()
                }
            }
        });
    });
});

engine.on('city-captured', function(city, player) {
    var capturedCity = this;

    city.player.cities = this.player.cities.filter(function(city) {
        return (city !== capturedCity)
    });
    city.player = player;
    player.cities.push(this);
});

engine.on('city-destroyed', function(city, player) {
    city.destroyed = true;

    if (!city.player.cities.map(function(city) {
        return city.destroyed;
    }).some(function(value) {
        return value === true;
    })) {
        // TODO: all cities destroyed
    }

    // TODO: remove from map
});

engine.on('city-grow', function(city) {
    city.autoAssignWorkers();
    city.calculateRates();
});

engine.on('city-shrink', function(city) {
    city.autoAssignWorkers();
    city.calculateRates();
});

engine.on('player-rate-change', function(player) {
    player.cities.forEach(function(city) {
        city.calculateRates();
    });
});

extend(engine, {
    City: class City {
        constructor(details) {
            var city = this;
            extend(this, details || {});

            city.build('militia');

            city.x = city.tile.x;
            city.y = city.tile.y;
            city.capital = (city.player.cities.length === 0);
            city.destroyed = false;
            city.size = 1;
            city.rates = {};
            city.foodStorage = 0;
            city.building = false;

            city.player.cities.push(city);

            // main city tile, always worked
            city.tile.city = city;
            // TODO: check for map plugin? Perhaps make a method in map to get tiles based on a matrix and a start offset...
            city.tiles = [
                engine.map.get(city.x, city.y - 1),
                engine.map.get(city.x - 1, city.y),
                engine.map.get(city.x, city.y + 1),
                engine.map.get(city.x + 1, city.y),
                engine.map.get(city.x + 1, city.y - 1),
                engine.map.get(city.x + 1, city.y + 1),
                engine.map.get(city.x - 1, city.y + 1),
                engine.map.get(city.x - 1, city.y - 1),
                engine.map.get(city.x, city.y - 2),
                engine.map.get(city.x + 2, city.y),
                engine.map.get(city.x, city.y + 2),
                engine.map.get(city.x - 2, city.y),
                engine.map.get(city.x + 1, city.y - 2),
                engine.map.get(city.x + 2, city.y - 1),
                engine.map.get(city.x + 2, city.y + 1),
                engine.map.get(city.x + 1, city.y + 2),
                engine.map.get(city.x - 1, city.y + 2),
                engine.map.get(city.x - 2, city.y + 1),
                engine.map.get(city.x - 2, city.y - 1),
                engine.map.get(city.x - 1, city.y - 2)
            ];

            engine.emit('tile-improvement-built', city.tile, 'irrigation');
            engine.emit('tile-improvement-built', city.tile, 'road');
            engine.emit('city-created', city, city.tile);

            // setup
            city.autoAssignWorkers();
            city.calculateRates();
        }

        autoAssignWorkers() {
            var city = this;

            city.tilesWorked = city.tiles.filter(function(tile) {
                return tile.isVisible(city.player.id);
            }).map(function(square, id) {
                return {
                    // TODO
                    weight: (
                        (square.food * 8) +
                        (square.production * 4) +
                        (square.trade * 2)
                    ),
                    id: id
                }
            }).sort(function(a, b) {
                return (a.weight > b.weight) ?
                    -1 :
                    (a.weight === b.weight) ?
                        0 :
                        1
            }).map(function(tile) {
                return tile.id;
            }).slice(0, this.size);
        }

        calculateRates() {
            var city = this,
            trade = Array(city.trade).fill(1);

            // TODO: check we have rates plugin available
            engine.availableTradeRates.forEach(function(rate) {
                city.rates[rate] = trade.splice(0, Math.ceil(city.player.getRate(rate) * city.trade)).reduce(function(total, value) {
                    return total + value;
                }, 0);
            });
        }

        resource(type) {
            var city = this;

            var total = city.tile[type] + city.tilesWorked.map(function(tileId) {
                return city.tiles[tileId][type];
            }).reduce(function(total, value) {
                return total + value;
            });

            // TODO: no hard-coded stuff!
            // Maybe something like:
            // city.player.government.resourceModifier(total);
            // if (city.player.government === 'despositm') {
            //     total = Math.ceil((total / 3) * 2);
            // }

            return total;
        }

        get trade() {
            return this.resource('trade');
        }

        get food() {
            return this.resource('food');
        }

        get production() {
            return this.resource('production');
        }

        get surplusFood() {
            return this.food - (this.size * 2);
        }

        get availableBuildItems() {
            // TODO
            return [{
                "unit": "settlers",
                "progress": 0
            }, {
                "unit": "militia",
                "progress": 0
            }, {
                "unit": "cavalry",
                "progress": 0
            }, {
                "building": "barracks",
                "progress": 0
            }];
        }

        build(itemName) {
            this.building = this.availableBuildItems.filter(function(item) {
                if ('unit' in item) {
                    return item.unit == itemName;
                }
                else if ('building' in item) {
                    return item.building == itemName;
                }
            })[0];

            console.log(JSON.stringify(this.building));
        }

        showCityScreen() {

        }
    }
});
