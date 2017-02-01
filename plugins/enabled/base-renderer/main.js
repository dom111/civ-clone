'use strict';

var layerOrder = [
    'terrain',
    'improvements',
    'cities'
];

game.on('start', function() {
    game.emit('build-layer', 'all');
    game.emit('update-display');

    game.map.map.forEach(function(row) {
        row.forEach(function(tile) {
            tile.on('improvement-built', function() {
                game.emit('build-layer', 'improvements');
                game.emit('update-display');
            });
        });
    });
});

game.on('tile-improvement-built', function(tile, improvement) {
    game.emit('build-layer', 'improvements');
    game.emit('update-display');
});

game.on('city-created', function(city, tile) {
    game.emit('build-layer', 'cities');
    game.emit('update-display');
});

game.on('city-grow', function(city, tile) {
    game.emit('build-layer', 'cities');
    game.emit('update-display');
});

game.on('build-layer', function(layer) {
    if (layer === 'terrain' || layer === 'all') {
        var tiles = [];

        game.map.map.forEach(function(row) {
            row.forEach(function(tile) {
                tiles.push({
                    images: (function() {
                        var images = [];

                        if ('adjacentImages' in tile.terrain && tile.adjacentTerrain) {
                            images.push(tile.terrain.adjacentImages[tile.adjacentTerrain]);
                        }
                        else {
                            images.push(tile.terrain.image);
                        }

                        if (tile.terrain.overlay) {
                            images.push(tile.terrain.overlay);
                        }

                        return images;
                    })(),
                    height: tile.terrain.size,
                    width: tile.terrain.size,
                    x: tile.terrain.size * tile.x,
                    y: tile.terrain.size * tile.y
                });
            });
        });

        var terrain = new Layer({
            name: 'terrain',
            tiles: tiles
        });

        // terrain layer
        layers.terrain = terrain.render();
    }

    if (layer === 'improvements' || layer === 'all') {
        var tiles = [];

        game.map.map.forEach(function(row) {
            row.forEach(function(tile) {
                tiles.push({
                    images: (function() {
                        var images = [];

                        tile.improvements.forEach(function(improvement) {
                            // TODO: improvement plugins?

                            if (improvement !== 'road') {
                                // always do road last
                                images.push('/Users/dom111/civ-one/plugins/enabled/base-terrain/assets/' + improvement + '.gif');
                            }
                        });

                        if (tile.improvements.includes('road')) {
                            var neighbours = tile.neighbours,
                            roadImages = [];

                            Object.keys(neighbours).forEach(function(direction) {
                                if (neighbours[direction].improvements.includes('road')) {
                                    roadImages.push('/Users/dom111/civ-one/plugins/enabled/base-terrain/assets/road_' + direction + '.gif');
                                }
                            });

                            if (roadImages.length === 0) {
                                roadImages.push('/Users/dom111/civ-one/plugins/enabled/base-terrain/assets/road.gif');
                            }

                            images = images.concat(roadImages);
                        }

                        return images;
                    })(),
                    height: tile.terrain.size,
                    width: tile.terrain.size,
                    x: tile.terrain.size * tile.x,
                    y: tile.terrain.size * tile.y
                });
            });
        });

        var improvements = new Layer({
            name: 'improvements',
            tiles: tiles
        });

        layers.improvements = improvements.render();
    }

    if (layer === 'cities' || layer === 'all') {
        var tiles = [];

        game.players.forEach(function(player) {
            player.cities.forEach(function(city) {
                tiles.push({
                    images: ['/Users/dom111/civ-one/plugins/enabled/base-terrain/assets/city.png'],
                    background: city.player.colour,
                    text: city.size,
                    textBelow: city.name,
                    height: city.tile.terrain.size,
                    width: city.tile.terrain.size,
                    x: city.tile.terrain.size * city.tile.x,
                    y: city.tile.terrain.size * city.tile.y
                });
            });
        });

        var cities = new Layer({
            name: 'cities',
            tiles: tiles
        });

        // terrain layer
        layers.cities = cities.render();
    }
});

game.on('update-display', function(layer) {
    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);

    layerOrder.forEach(function(layer, i) {
        context.drawImage(layers[layer], 0, 0);
    });
});

var Layer = class Layer {
    constructor(details) {
        var layer = this;

        extend(layer, details);

        layer.canvas = document.createElement('canvas');
        layer.canvas.width = window.innerWidth;
        layer.canvas.height = window.innerHeight;
        layer.context = layer.canvas.getContext('2d');
        layer.images = {};

        layer.tiles.forEach(function(tile) {
            tile.images = tile.images.map(function(image) {
                if (!(image in layer.images)) {
                    layer.images[image] = new global.Image();
                    layer.images[image].src = 'file://' + image;
                    document.getElementById('preload').appendChild(layer.images[image]);
                }

                return layer.images[image];
            });
        });
    }

    render() {
        var layer = this;

        layer.tiles.forEach(function(tile) {
            if (tile.background) {
                layer.context.fillStyle = tile.background;
                layer.context.fillRect(tile.x, tile.y, tile.width, tile.height);
            }

            tile.images.forEach(function(image) {
                layer.context.drawImage(image, tile.x, tile.y, tile.width, tile.height);
            });

            if (tile.text) {
                layer.context.font = 'bold 10px sans-serif';
                layer.context.fillStyle = 'black';
                layer.context.textAlign="center";
                layer.context.fillText(tile.text, tile.x + 8, tile.y + 11);
            }
        });

        return layer.canvas;
    }
};

var layers = {};

document.body.appendChild(
    (function(element) {
        element.id = 'game';
        element.innerHTML = '<canvas id="display"></canvas>';
        element.style.position = 'absolute';
        element.style.top = '0px';
        element.style.left = '0px';
        element.style.zIndex = '1';
        element.width = window.innerWidth;
        element.height = window.innerHeight;
        element.style.background = '#000 none';
        return element;
    })(document.createElement('section'))
);

// TODO
document.body.appendChild(
    (function(element) {
        element.id = 'preload';
        element.style.opacity = 0;
        return element;
    })(document.createElement('div'))
);

var canvas = document.getElementById('display'),
context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('mousedown', function(event) {
    var tile = game.map.get(parseInt(event.pageX / 16), parseInt(event.pageY / 16));
    console.log(tile);
});

