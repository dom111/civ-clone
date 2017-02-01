'use strict';

// bind events - could be in a static method of City?
engine.on('turn-end', () => {
    engine.players.forEach((player) => {
        player.cities.forEach((city) => {
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

    city.player.cities = this.player.cities.filter((city) => (city !== capturedCity));
    city.player = player;
    player.cities.push(this);
});

engine.on('city-destroyed', (city, player) => {
    city.destroyed = true;

    if (!city.player.cities.map((city) => city.destroyed).some((value) => value === true)) {
        // TODO: all cities destroyed
    }

    // TODO: remove from map
});

engine.on('city-grow', (city) => {
    city.autoAssignWorkers();
    city.calculateRates();
});

engine.on('city-shrink', (city) => {
    city.autoAssignWorkers();
    city.calculateRates();
});

engine.on('player-rate-change', (player) => player.cities.forEach((city) => city.calculateRates()));

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

        get ratesArray() {
            var city = this,
            trade = Array(city.trade).fill(1);

            // TODO: check we have rates plugin available
            return engine.availableTradeRates.map((rate) => ({
                name: rate,
                value: city.rates[rate]
            }));
        }

        autoAssignWorkers() {
            var city = this;

            city.tilesWorked = city.tiles.filter((tile) => tile.isVisible(city.player.id)).map((square, id) => {
                return {
                    // TODO
                    weight: (
                        (square.food * 8) +
                        (square.production * 4) +
                        (square.trade * 2)
                    ),
                    id: id
                }
            }).sort((a, b) => (a.weight > b.weight) ? -1 : (a.weight === b.weight) ? 0 : 1).map((tile) => tile.id).slice(0, this.size);
        }

        calculateRates() {
            var city = this,
            trade = Array(city.trade).fill(1);

            // TODO: check we have rates plugin available
            engine.availableTradeRates.forEach((rate) => {
                city.rates[rate] = trade.splice(0, Math.ceil(city.player.getRate(rate) * city.trade)).reduce((total, value) => total + value, 0);
            });
        }

        resource(type) {
            var city = this;

            var total = city.tile[type] + city.tilesWorked.map((tileId) => city.tiles[tileId][type]).reduce((total, value) => total + value);

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
                "progress": 0,
                "cost": 40
            }, {
                "unit": "militia",
                "progress": 0,
                "cost": 10
            }, {
                "unit": "cavalry",
                "progress": 0,
                "cost": 20
            }, {
                "building": "barracks",
                "progress": 0,
                "cost": 40
            }];
        }

        build(itemName) {
            this.building = this.availableBuildItems.filter((item) => {
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
            var city = this,
            _show = () => {
                // view = global.renderer.addToBody(engine.template(plugin.getFirst('template', 'city-view').contents[0], extend({}, city.valueOf())))
                view = global.renderer.addToBody(engine.template(Engine.Plugin.filter({type: 'template', label: 'city-view', package: 'base-city'})[0].contents[0], extend({}, city.valueOf())))

                // TODO: bind more clicks
                view.querySelector('.close').addEventListener('click', _remove);

                view.querySelector('.change').addEventListener('click', () => {
                    city.building = city.availableBuildItems[Date.now()%city.availableBuildItems.length];
                    _refresh();
                });

                return view;
            },
            _remove = () => view.parentNode.removeChild(view),
            _refresh = () => {
                _remove();
                _show();
            },
            view;

            _show();
        }

        valueOf() {
            var city = this,
            r = extend({}, this);

            // getters
            ['ratesArray', 'trade', 'food', 'production', 'surplusFood', 'availableBuildItems'].forEach((key) => {
                r[key] = city[key];
            });

            return r;
        }
    }
});
