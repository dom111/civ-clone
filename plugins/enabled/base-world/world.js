'use strict';

extend(engine, {
    World: class World {
        constructor() {
            var map = this;

            map.terrain = [];

            // map.seed = Math.ceil(Math.random() * 1e7);
            map.seed = 615489;

            Engine.Plugin.get('terrain').forEach((terrain) => {
                terrain.contents.forEach((file) => {
                    var terrainDefinition = engine.loadJSON(file);

                    if ('image' in terrainDefinition) {
                        terrainDefinition.image = terrain.__path + terrainDefinition.image;
                    }

                    if ('adjacentImages' in terrainDefinition) {
                        Object.keys(terrainDefinition.adjacentImages).forEach((key) => terrainDefinition.adjacentImages[key] = terrain.__path + terrainDefinition.adjacentImages[key]);
                    }

                    if ('special' in terrainDefinition) {
                        terrainDefinition.special = terrainDefinition.special.map((special) => {
                            if ('overlay' in special) {
                                special.overlay = terrain.__path + special.overlay;
                            }

                            return special;
                        });
                    }

                    terrainDefinition.id = map.terrain.length;

                    map.terrain.push(terrainDefinition);
                });
            });

            map.map = map.generate().map((row, y) => row.map((terrainId, x) => new engine.World.Tile({
                x: x,
                y: y,
                terrainId: terrainId,
                terrain: map.getTerrainType(terrainId),
                map: map
            })));
        }

        visibility(playerId, x, y) {
            return this.map[x][y].isVisible(playerId);
        }

        get width() {
            return this.map[0].length;
        }

        get height() {
            return this.map.length;
        }

        getBy(filterFunction) {
            return this.map.reduce((a, b) => a.concat(b), []).filter(filterFunction);
        }

        get(x, y, normalise) {
            // TODO: check map type
            if (x > (this.width - 1)) {
                x -= this.width;
            }
            else if (x < 0) {
                x += this.width;
            }

            if (y > (this.height - 1)) {
                y -= this.height;
            }
            else if (y < 0) {
                y += this.height;
            }

            return (this.map[y] || [])[x] || false;
        }

        getTerrainType(id) {
            return this.terrainTypes[id];
        }

        get terrainTypes() {
            return this.terrain;
        }

        generate(options) {
            let map = this;
            options = options || {};

            let mapHeight = options.height || 100;
            let mapWidth = options.width || 160;

            let seedDensity = options.seedDenisity || 3; // controls how many seed locations there are
            let iterations = options.iterations || 45; // iterations of applying neighbouring land
            let chanceToBecomeLand = options.chanceToBecomeLand || 0.02; // chance to become land
            let clusterChance = options.clusterChance || 0.66; // chance for adjacent tiles to cluster
            let pathChance = options.pathChance || 0.66; // chance for directly adjacent tiles to be part of the path
            let coverageScale = options.coverageScale || 0.66; // this scales the coverage, this could (and should) be factored in to the coverage for each tile

            //
            let _getNeighbours = (n, h, w, d) => {
                // TODO: this needs to handle wrapping
                return (d ? [n - w, n - 1, n + 1, n + w] : [n - (w + 1), n - w, n - (w - 1), n - 1, n + 1, n + (w - 1), n + w, n + (w + 1)]).filter(x => x < (w * h) && x > -1);
            };

            // Build land masses
            let generateLand = (h, w) => {
                let m = Array(h * w).fill(0);
                let t = iterations;

                let s = Math.ceil(Math.sqrt(h * w) * seedDensity);
                while (s-- > 0) {
                    m[Math.floor(Math.random() * (h * w))] = 1;
                }

                while (t-- > 0) {
                    m.map((v, i) => v ? i : false).filter(v => v).forEach(n => {
                        _getNeighbours(n, h, w).filter(n => !m[n]).forEach(n => {
                            if (Math.random() < chanceToBecomeLand) {
                                m[n] = 1;
                            }
                        });
                    });
                }

                return m;
            };

            //
            let populateTerrain = (m, h, w) => {
                let landCells = m.map((v, i) => i).filter(v => m[v]);
                map.terrainTypes.forEach(terrain => {
                    // TODO: have custom water tiles and check if land/ocean
                    if (terrain.distribution) {
                        terrain.distribution.forEach(d => {
                            let rangeCells = landCells.filter(n => n >= ((d.from * h) * w) && n <= ((d.to * h) * w));
                            // alternatively, && m[n] != 0 to change existing changed land
                            // TODO: fudgeFactor
                            let max = (rangeCells.length * d.coverage) * coverageScale;
                            rangeCells = rangeCells.filter(n => m[n] === 1);

                            max = Math.floor(Math.min(max, rangeCells.length));

                            while (max > 0) {
                                let n = rangeCells[Math.floor(Math.random() * rangeCells.length)];
                                m[n] = terrain.id;
                                max--;

                                let neighbours = [];

                                if (d.clustered || d.path) {
                                    neighbours = _getNeighbours(n, h, w).filter(k => rangeCells.includes(k));
                                }

                                if (d.clustered) {
                                    neighbours.forEach(k => {
                                        // TODO: clusterChance
                                        if (Math.random() < clusterChance) {
                                            m[k] = terrain.id;
                                            max--;
                                        }
                                    });
                                }
                                else if (d.path) {
                                    while (neighbours.length && Math.random() < pathChance) {
                                        let cell = neighbours[Math.floor(Math.random() * neighbours.length)];
                                        m[cell] = terrain.id;
                                        neighbours = _getNeighbours(cell, h, w, true).filter(k => rangeCells.includes(k));
                                    }
                                }
                            }
                        });
                    }
                });

                return m;
            };

            let mapData = populateTerrain(generateLand(mapHeight, mapWidth), mapHeight, mapWidth);

            let r = [];
            let i = 0;

            for (; i < mapHeight; i++) {
                r.push(mapData.slice(i * mapHeight, (i + 1) * mapHeight));
            }

            return r;
        }

        load() {
            // TODO
        }
    }
});

extend(engine.World, {
    Tile: class Tile {
        constructor(details) {
            var tile = this;

            extend(tile, details);

            // keep this as its own instance
            tile.terrain = extend({}, tile.terrain);

            if (!(tile.map instanceof engine.World)) {
                throw "Invalid Tile definition.";
            }

            tile.improvements = [];
            tile.city = false;
            tile.units = [];
            tile.seenBy = {};

            // when generating use this:
            // tile.seed = Math.ceil(Math.random() * 1e7);
            // tile.seed = tile.seed || (tile.x * tile.y * (tile.terrainId || 255));
            tile.seed = tile.seed || (tile.x ^ tile.y + (tile.terrainId || 255));

            if ('special' in tile.terrain && Array.isArray(tile.terrain.special)) {
                if (Array.isArray(tile.terrain.special) && tile.terrain.special.length) {
                    var special = tile.terrain.special[Math.floor(tile.terrain.special.length * Math.random())];
                    if ((tile.seed + tile.map.seed * ((tile.x + 1) + (tile.y + 1))) % 100 < special.chance) {
                        tile.terrain.special = special;
                    }
                }
            }

            if (Array.isArray(tile.terrain.special)) {
                tile.terrain.special = false;
            }
        }

        get neighbours() {
            return {
                n: this.map.get(this.x, this.y - 1),
                ne: this.map.get(this.x + 1, this.y - 1),
                e: this.map.get(this.x + 1, this.y),
                se: this.map.get(this.x + 1, this.y + 1),
                s: this.map.get(this.x, this.y + 1),
                sw: this.map.get(this.x - 1, this.y + 1),
                w: this.map.get(this.x - 1, this.y),
                nw: this.map.get(this.x - 1, this.y - 1)
            };
        }

        get adjacent() {
            return {
                n: this.map.get(this.x, this.y - 1),
                e: this.map.get(this.x + 1, this.y),
                w: this.map.get(this.x - 1, this.y),
                s: this.map.get(this.x, this.y + 1)
            };
        }

        // this is used to help with rendering contiguous terrain types
        get adjacentTerrain() {
            var tile = this,
            adjacent = tile.adjacent,
            result = '';

            return ['n', 'e', 's', 'w'].filter((position) => (adjacent[position].terrainId === tile.terrainId)).join('');
        }

        get isOcean() {
            return this.terrain.ocean;
        }

        get isCoast() {
            var tile = this;

            return tile.isOcean &&
                Object.keys(tile.neighbours).some((direction) => tile.neighbours[direction].isLand);
        }

        get coast() {
            var tile = this;

            return Object.keys(this.neighbours).filter((direction) => tile.neighbours[direction].isLand);
        }

        get isLand() {
            return this.terrain.land;
        }

        isVisible(playerId) {
            return this.seenBy[playerId];
        }

        isActivelyVisible(playerId) {
            return engine.players[playerId].visibleTiles.includes(this);
        }

        resource(type) {
            var tile = this;

            if ((typeof tile.terrain[type] === 'function')) {
                tile.terrain[type] = tile.terrain[type](tile.map, tile.x, tile.y);
            }

            return (this.terrain[type] + tile.improvements.map((improvement) => (tile.terrain.improvements[improvement] || {})[type] || 0).reduce((total, value) => total + value, 0)) || 0;
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

        get score() {
            return this.food * 8 + this.production * 4 + this.trade * 2;
        }

        get surroundingArea() {
            // TODO: make this take an argument of the layout and return the surrounding tiles based on that
            let map = this.map;
            let x = this.x;
            let y = this.y;

            return [
                map.get(x - 1, y - 2),
                map.get(x, y - 2),
                map.get(x + 1, y - 2),
                map.get(x - 2, y - 1),
                map.get(x - 1, y - 1),
                map.get(x, y - 1),
                map.get(x + 1, y - 1),
                map.get(x + 2, y - 1),
                map.get(x - 2, y),
                map.get(x - 1, y),
                map.get(x, y),
                map.get(x + 1, y),
                map.get(x + 2, y),
                map.get(x - 2, y + 1),
                map.get(x - 1, y + 1),
                map.get(x, y + 1),
                map.get(x + 1, y + 1),
                map.get(x + 2, y + 1),
                map.get(x - 1, y + 2),
                map.get(x, y + 2),
                map.get(x + 1, y + 2)
            ];
        }

        movementCost(to) {
            // TODO: these defined separately, improvement plugins?
            if (this.improvements.includes('railroad') && to.improvements.includes('railroad')) {
                // TODO: unless goto...
                return 0;
            }
            else if (this.improvements.includes('road') && to.improvements.includes('road')) {
                return 1 / 3;
            }
            else {
                return to.terrain.movementCost;
            }
        }
    }
});

// events
engine.on('tile-improvement-built', (tile, improvement) => {
    if (!tile.improvements.includes(improvement)) {
        tile.improvements.push(improvement);
    }
});

engine.on('tile-improvement-pillaged', (tile, improvement) => {
    if (tile.improvements.includes(improvement)) {
        tile.improvements = tile.improvements.filter((currentImprovement) => currentImprovement !== improvement);
    }
});

engine.on('tile-seen', (tile, player) => tile.seenBy[player.id] = 1);

engine.on('build', () => engine.map = new engine.World());
