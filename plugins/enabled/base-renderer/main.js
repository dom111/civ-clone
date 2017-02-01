'use strict';

// TODO: renderer base class?
// global.BaseRenderer = class BaseRenderer extends Renderer {
var BaseRenderer = global.BaseRenderer = class BaseRenderer {
    constructor() {
        var renderer = this;

        renderer.layerOrder = [
            'land',
            'irrigation',
            'baseTerrain',
            'otherImprovements',
            'cities',
            'units',
            'activeUnits',
            'visibility'
        ];

        renderer.layers = {};

        renderer.preload = document.getElementById('preload');

        if (!renderer.preload) {
            renderer.preload = (function(element) {
                element.id = 'preload';
                element.style.opacity = 0;
                return element;
            })(document.createElement('div'));

            document.body.appendChild(renderer.preload);
        }

        plugin.get('asset').forEach(function(component) {
            component.contents.forEach(function(assetPath) {
                renderer.preload.innerHTML += '<img src="file://' + assetPath + '"/>';
            });
        });
    }

    init() {
        var renderer = this;

        document.body.appendChild(
            (function(element) {
                element.id = 'game';
                element.innerHTML = '<canvas id="display"></canvas>';
                element.style.position = 'absolute';
                element.style.top = '0px';
                element.style.left = '0px';
                element.style.zIndex = '1';
                element.style.width = '100%';
                element.style.height = '100%';
                element.width = window.innerWidth;
                element.height = window.innerHeight;
                element.style.background = '#000 none';
                return element;
            })(document.createElement('section'))
        );

        renderer.canvas = document.getElementById('display'),
        renderer.canvas.width = window.innerWidth;
        renderer.canvas.height = window.innerHeight;
        renderer.context = renderer.canvas.getContext('2d');

        renderer.canvas.addEventListener('mousedown', function(event) {
            var x = event.pageX,
            y = event.pageY,
            tileSize = game.map.get(0, 0).terrain.size * game.scale;

            x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
            y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

            x = parseInt(x / tileSize);
            y = parseInt(y / tileSize);

            x = renderer.center.x + x;
            y = renderer.center.y + y;

            var tile = game.map.get(x, y);

            if (tile.city) {
                tile.city.showCityScreen();
            }
            else if (tile.units.length) {
                console.log(tile.units);
            }
            else {
                renderer.center = tile;
            }
        });

        renderer.canvas.addEventListener('mousemove', function(event) {
            if (event.shiftKey) {
                var x = event.pageX,
                y = event.pageY,
                tileSize = game.map.get(0, 0).terrain.size * game.scale;

                x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
                y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

                x = parseInt(x / tileSize);
                y = parseInt(y / tileSize);

                x = renderer.center.x + x;
                y = renderer.center.y + y;

                var tile = game.map.get(x, y);
                console.log(tile.x, tile.y);
            }
        });

        // TODO: throttle
        addEventListener('resize', function() {
            renderer.canvas.height = window.innerHeight;
            renderer.canvas.width = window.innerWidth;

            game.emit('build-layer', 'all');
            game.emit('update-display');
        });

        game.on('build-layer', function(layer) {
            renderer.buildLayer(layer);
        });

        game.on('update-display', function(layersToProcess) {
            renderer.updateDisplay(layersToProcess);
        });

        renderer.hideFlag = false;
        renderer.interval = setInterval(function() {
            game.emit('update-display', renderer.layerOrder.filter(function(layer) {
                if ((layer === 'activeUnits') && renderer.hideFlag) {
                    return false;
                }

                return true;
            }));

            renderer.hideFlag = !renderer.hideFlag;

            // TODO: pallette cycling for coast/river animations
        }, 125);

        document.body.style.cursor = 'url("' + __path + 'assets/cursor/torch.gif"), auto';

        game.on('tile-improvement-built', function(tile, improvement) {
            if (improvement === 'irrigation') {
                game.emit('build-layer', improvement);
            }
            else {
                game.emit('build-layer', 'otherImprovements');
            }
        });

        game.on('tile-improvement-pillaged', function(tile, improvement) {
            if (improvement === 'irrigation') {
                game.emit('build-layer', improvement);
            }
            else {
                game.emit('build-layer', 'otherImprovements');
            }
        });

        game.on('tile-seen', function(tile) {
            game.emit('build-layer', 'visibility');
        });

        game.on('city-created', function(city, tile) {
            game.emit('build-layer', 'cities');
        });

        game.on('city-grow', function(city, tile) {
            game.emit('build-layer', 'cities');
        });

        game.on('unit-moved', function(unit, tile) {
            game.emit('build-layer', 'units');
            game.emit('build-layer', 'activeUnits');
        });

        game.on('unit-created', function(unit, tile) {
            game.emit('build-layer', 'units');
            game.emit('build-layer', 'activeUnits');
        });

        game.on('unit-destroyed', function(unit, tile) {
            game.emit('build-layer', 'units');
            game.emit('build-layer', 'activeUnits');
        });

        game.on('unit-activated', function(unit, tile) {
            game.emit('build-layer', 'units');
            game.emit('build-layer', 'activeUnits');
        });

        game.on('turn-over', function(unit, tile) {
            game.emit('build-layer', 'units');
            game.emit('build-layer', 'activeUnits');
        });

        game.on('unit-activate', function(unit) {
            game.emit('build-layer', 'units');
            game.emit('build-layer', 'activeUnits');
        });

        game.emit('bind-key', 'unit', 'c', function() {
            if (game.currentPlayer && game.currentPlayer.activeUnit) {
                renderer.center = game.currentPlayer.activeUnit.tile;
            }
        });

        game.emit('build-layer', 'all');
    }

    buildLayer(layer) {
        var renderer = this;

        if (layer === 'land' || layer === 'all') {
            var tiles = [];

            game.map.map.forEach(function(row) {
                row.forEach(function(tile) {
                    tiles.push({
                        images: (function() {
                            var images = [];

                            if (tile.isOcean) {
                                images.push(__path + 'assets/terrain/ocean.gif');
                            }
                            else if (tile.isLand) {
                                images.push(__path + 'assets/terrain/land.gif');
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

            var land = new BaseRenderer.Layer({
                name: 'land',
                tiles: tiles
            });

            // terrain layer
            renderer.layers.land = land.render();
        }

        if (layer === 'irrigation' || layer === 'all') {
            var tiles = [];

            game.map.map.forEach(function(row) {
                row.forEach(function(tile) {
                    if (tile.improvements.includes('irrigation')) {
                        tiles.push({
                            images: [__path + 'assets/improvements/irrigation.gif'],
                            height: tile.terrain.size,
                            width: tile.terrain.size,
                            x: tile.terrain.size * tile.x,
                            y: tile.terrain.size * tile.y
                        });
                    }
                });
            });

            var irrigation = new BaseRenderer.Layer({
                name: 'irrigation',
                tiles: tiles
            });

            renderer.layers.irrigation = irrigation.render();
        }

        if (layer === 'baseTerrain' || layer === 'all') {
            var tiles = [];

            game.map.map.forEach(function(row) {
                row.forEach(function(tile) {
                    var images = [];

                    if (tile.isOcean) {
                        if (tile.isCoast) {
                            var sprite = new global.Image();
                            sprite.src = __path + 'assets/terrain/coast_sprite.gif';
                            var image = document.createElement('canvas'),
                            imageContext = image.getContext('2d'),

                            // formula from: http://forums.civfanatics.com/showpost.php?p=13507808&postcount=40
                            // Build a bit mask of all 8 surrounding tiles, setting the bit if the tile is not an
                            // ocean tile. Starting with the tile to the left as the least significant bit and
                            // going clockwise
                            bitmask =
                                (!tile.neighbours.w.isOcean ? 1 : 0)|
                                (!tile.neighbours.nw.isOcean ? 2 : 0)|
                                (!tile.neighbours.n.isOcean ? 4 : 0)|
                                (!tile.neighbours.ne.isOcean ? 8 : 0)|
                                (!tile.neighbours.e.isOcean ? 16 : 0)|
                                (!tile.neighbours.se.isOcean ? 32 : 0)|
                                (!tile.neighbours.s.isOcean ? 64 : 0)|
                                (!tile.neighbours.sw.isOcean ? 128 : 0);

                            image.width = image.height = 16;

                            if (bitmask > 0) {
                                // There are at least one surrounding tile that is not ocean, so we need to render
                                // coast. We divide the tile into four 8x8 subtiles and for each of these we want
                                // a 3 bit bitmask of the surrounding tiles. We do this by looking at the 3 least
                                // significant bits for the top left subtile and shift the mask to the right as we
                                // are going around the tile. This way we are "rotating" our bitmask. The result
                                // are our x offsets into ter257.pic
                                var topLeftSubtileOffset = (bitmask & 7),
                                topRightSubtileOffset = ((bitmask >> 2) & 7),
                                bottomRightSubtileOffset = ((bitmask >> 4) & 7),
                                bottomLeftSubtileOffset = ((bitmask >> 6) & 7)|((bitmask & 1) << 2);

                                imageContext.drawImage(sprite, topLeftSubtileOffset << 4, 0, 8, 8, 0, 0, 8, 8);
                                imageContext.drawImage(sprite, (topRightSubtileOffset << 4)+8, 0, 8, 8, 8, 0, 8, 8);
                                imageContext.drawImage(sprite, (bottomRightSubtileOffset << 4)+8, 8, 8, 8, 8, 8, 8, 8);
                                imageContext.drawImage(sprite, bottomLeftSubtileOffset << 4, 8, 8, 8, 0, 8, 8, 8);
                            }

                            images.push(image);

                            ['n', 'e', 's', 'w'].filter(function(direction) {
                                return (tile.adjacent[direction].terrain.name === 'river')
                            }).forEach(function(direction) {
                                images.push(__path + 'assets/terrain/river_mouth_' + direction + '.gif');
                            });
                        }

                        if (tile.terrain.special) {
                            images.push(__path + 'assets/terrain/' + tile.terrain.special.name + '.gif');
                        }
                    }
                    else {
                        if (tile.terrain.name === 'river') {
                            var adjoining = ['n', 'e', 's', 'w'].filter(function(direction) {
                                return (tile.adjacent[direction].isOcean || (tile.adjacent[direction].terrainId === tile.terrainId))
                            }).join('');

                            if (adjoining) {
                                images.push(__path + 'assets/terrain/' + tile.terrain.name + '_' + adjoining + '.gif');
                            }
                            else {
                                images.push(__path + 'assets/terrain/' + tile.terrain.name + '.gif');
                            }
                        }
                        else {
                            var adjoining = tile.adjacentTerrain;

                            if (adjoining) {
                                images.push(__path + 'assets/terrain/' + tile.terrain.name + '_' + adjoining + '.gif');
                            }
                            else {
                                images.push(__path + 'assets/terrain/' + tile.terrain.name + '.gif');
                            }

                            if (tile.terrain.special) {
                                images.push(__path + 'assets/terrain/' + tile.terrain.special.name + '.gif');
                            }
                        }
                    }

                    if (images.length) {
                        tiles.push({
                            images: images,
                            height: tile.terrain.size,
                            width: tile.terrain.size,
                            x: tile.terrain.size * tile.x,
                            y: tile.terrain.size * tile.y
                        });
                    }
                });
            });

            var baseTerrain = new BaseRenderer.Layer({
                name: 'baseTerrain',
                tiles: tiles
            });

            // terrain layer
            renderer.layers.baseTerrain = baseTerrain.render();
        }

        if (layer === 'otherImprovements' || layer === 'all') {
            var tiles = [];

            game.map.map.forEach(function(row) {
                row.forEach(function(tile) {
                    var otherImprovements = tile.improvements.filter(function(improvement) {
                        return improvement !== 'irrigation';
                    });

                    if (otherImprovements.length) {
                        tiles.push({
                            images: (function() {
                                var images = [];

                                otherImprovements.forEach(function(improvement) {
                                    if (improvement === 'road' && !otherImprovements.includes('railroad')) {
                                        var adjoining = Object.keys(tile.neighbours).filter(function(direction) {
                                            return tile.neighbours[direction].improvements.includes('road');
                                        });

                                        if (adjoining.length) {
                                            adjoining.forEach(function(direction) {
                                                images.push(__path + 'assets/improvements/' + improvement + '_' + direction + '.gif');
                                            });
                                        }
                                        else {
                                            images.push(__path + 'assets/improvements/' + improvement + '.gif');
                                        }
                                    }
                                    else if (improvement === 'railroad') {
                                        var adjoining = Object.keys(tile.neighbours).filter(function(direction) {
                                            return tile.neighbours[direction].improvements.includes('road');
                                        });

                                        if (adjoining.length) {
                                            adjoining.forEach(function(direction) {
                                                images.push(__path + 'assets/improvements/' + improvement + '_' + direction + '.gif');
                                            });
                                        }
                                        else {
                                            images.push(__path + 'assets/improvements/' + improvement + '.gif');
                                        }
                                    }
                                    else {
                                        images.push(__path + 'assets/improvements/' + improvement + '.gif');
                                    }
                                });

                                return images;
                            })(),
                            height: tile.terrain.size,
                            width: tile.terrain.size,
                            x: tile.terrain.size * tile.x,
                            y: tile.terrain.size * tile.y
                        });
                    }
                });
            });

            var otherImprovements = new BaseRenderer.Layer({
                name: 'otherImprovements',
                tiles: tiles
            });

            renderer.layers.otherImprovements = otherImprovements.render();
        }

        if (layer === 'units' || layer === 'all') {
            var tiles = [];

            game.map.map.forEach(function(row) {
                row.forEach(function(tile) {
                    if (!game.currentPlayer || !game.currentPlayer.activeUnit || game.currentPlayer.activeUnit.tile !== tile) {
                        var unit = tile.units.sort(function(a, b) {
                            return a.defence > b.defense ? -1 : a.defense == a.defense ? 0 : 1;
                        })[0],
                        images = [];

                        if (tile.units.length) {
                            var image = document.createElement('canvas'),
                            imageContext = image.getContext('2d'),
                            unitImage = new global.Image;
                            unitImage.src = 'file://' + __path + 'assets/units/' + unit.name + '.gif'; // TODO: have each unit details as a component
                            image.width = unitImage.width;
                            image.height = unitImage.height;

                            if (tile.units.length > 1) {
                                image.width = unitImage.width + 1;
                                image.height = unitImage.height + 1;
                                imageContext.drawImage(unitImage, 1, 1);
                            }

                            imageContext.drawImage(unitImage, 0, 0);
                            imageContext.save();

                            images.push(image);

                            if (images.length) {
                                var sourceColors = plugin.get('asset', 'units')[0].sourceColors;
                                var replaceColors = unit.player.colors;

                                tiles.push({
                                    images: images.map(function(image) {
                                        if ('getContext' in image) {
                                            image = renderer.replaceColor(image, sourceColors, replaceColors)
                                        }

                                        return image;
                                    }),
                                    text: unit.busy ? unit.currentAction.key.toUpperCase() : '',
                                    height: unit.height,
                                    width: unit.width,
                                    x: unit.tile.terrain.size * unit.tile.x,
                                    y: unit.tile.terrain.size * unit.tile.y
                                });
                            }
                        }
                    }
                });
            });

            var units = new BaseRenderer.Layer({
                name: 'units',
                tiles: tiles
            });

            // terrain layer
            renderer.layers.units = units.render();
        }

        if (layer === 'cities' || layer === 'all') {
            var tiles = [];

            game.players.forEach(function(player) {
                player.cities.forEach(function(city) {
                    tiles.push({
                        images: [__path + 'assets/map/city.gif'],
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

            var cities = new BaseRenderer.Layer({
                name: 'cities',
                tiles: tiles
            });

            // terrain layer
            renderer.layers.cities = cities.render();
        }

        if (layer === 'activeUnits' || layer === 'all') {
            var tiles = [];

            if (game.currentPlayer && game.currentPlayer.activeUnit) {
                var unit = game.currentPlayer.activeUnit,
                tile = unit.tile,
                images = [];

                if (tile.units.length) {
                    var image = document.createElement('canvas'),
                    imageContext = image.getContext('2d'),
                    unitImage = new global.Image;
                    unitImage.src = 'file://' + __path + 'assets/units/' + unit.name + '.gif';
                    image.width = unitImage.width;
                    image.height = unitImage.height;

                    if (tile.units.length > 1) {
                        image.width = unitImage.width + 1;
                        image.height = unitImage.height + 1;
                        imageContext.drawImage(unitImage, 1, 1);
                    }

                    imageContext.drawImage(unitImage, 0, 0);
                    imageContext.save();

                    images.push(image);

                    if (images.length) {
                        var sourceColors = plugin.get('asset', 'units')[0].sourceColors;
                        var replaceColors = game.currentPlayer.colors;

                        tiles.push({
                            images: images.map(function(image) {
                                return renderer.replaceColor(image, sourceColors, replaceColors);
                            }),
                            text: unit.busy ? unit.currentAction.key.toUpperCase() : '',
                            height: unit.height,
                            width: unit.width,
                            x: unit.tile.terrain.size * unit.tile.x,
                            y: unit.tile.terrain.size * unit.tile.y
                        });
                    }
                }
            }

            var activeUnits = new BaseRenderer.Layer({
                name: 'activeUnits',
                tiles: tiles
            });

            // terrain layer
            renderer.layers.activeUnits = activeUnits.render();
        }

        if (layer === 'visibility' || layer === 'all') {
            var tiles = [],
            player = game.currentPlayer;

            game.map.map.forEach(function(row) {
                row.forEach(function(tile) {
                    if (!tile.isVisible(player.id)) {
                        tiles.push({
                            background: '#000',
                            height: tile.terrain.size,
                            width: tile.terrain.size,
                            x: tile.terrain.size * tile.x,
                            y: tile.terrain.size * tile.y
                        });
                    }
                    else {
                        var images = [];

                        ['n', 'e', 's', 'w'].forEach(function(direction) {
                            if (!tile.adjacent[direction].isVisible(player.id)) {
                                images.push(__path + 'assets/map/fog_' + direction + '.gif');
                            }
                        });

                        if (images.length) {
                            tiles.push({
                                images: images,
                                height: tile.terrain.size,
                                width: tile.terrain.size,
                                x: tile.terrain.size * tile.x,
                                y: tile.terrain.size * tile.y
                            });
                        }
                    }
                });
            });

            var visibility = new BaseRenderer.Layer({
                name: 'visibility',
                tiles: tiles
            });

            renderer.layers.visibility = visibility.render();
        }

        renderer.updateDisplay();
    }

    replaceColor(canvas, source, replacement) {
        var context = canvas.getContext('2d');
        context.save();
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var _getColor = function(input) {
            var match = [],
            color = {};

            if (typeof(input) === 'string') {
                if (match = input.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/)) {
                    color = {
                        r: parseInt(match[1], 16),
                        g: parseInt(match[2], 16),
                        b: parseInt(match[3], 16),
                        a: 1
                    };
                }
                else if (match = input.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/)) {
                    color = {
                        r: parseInt(match[1] + match[1], 16),
                        g: parseInt(match[2] + match[2], 16),
                        b: parseInt(match[3] + match[3], 16),
                        a: 1
                    };
                }
                else if (match = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)) {
                    color = {
                        r: parseInt(match[1]),
                        g: parseInt(match[2]),
                        b: parseInt(match[3]),
                        a: 1
                    };
                }
                else if (match = input.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d+\.|\.\d+|\d+\.\d+)\s*\)\s*$/)) {
                    color = {
                        r: parseInt(match[1]),
                        g: parseInt(match[2]),
                        b: parseInt(match[3]),
                        a: parseFloat(match[4])
                    };
                }
            }
            else if ('length' in input) {
                color = {
                    r: input[0] || 0,
                    g: input[1] || 0,
                    b: input[2] || 0,
                    a: input[3] || 1
                };
            }

            return color;
        };

        var sourceColors = source.map(_getColor),
        replaceColors = replacement.map(_getColor);

        for (var i = 0; i < imageData.data.length; i += 4) {
            sourceColors.forEach(function(color, n) {
                if (imageData.data[i] === color.r && imageData.data[i + 1] === color.g && imageData.data[i + 2] === color.b) {
                    imageData.data[i] = (replaceColors[n] || replaceColors[0]).r;
                    imageData.data[i + 1] = (replaceColors[n] || replaceColors[0]).g;
                    imageData.data[i + 2] = (replaceColors[n] || replaceColors[0]).b;
                    imageData.data[i + 3] = parseInt((replaceColors[n] || replaceColors[0]).a * 255);
                }
            });
        }

        context.putImageData(imageData, 0, 0);

        return canvas;
    }

    updateDisplay(layersToProcess) {
        var renderer = this;

        renderer.portal = document.createElement('canvas');
        renderer.portal.width = window.innerWidth;
        renderer.portal.height = window.innerHeight;
        renderer.portalContext = renderer.portal.getContext('2d');

        game.scale = game.scale || 1;

        if (!renderer.center) {
            renderer.center = game.currentPlayer && game.currentPlayer.activeUnit ?
                game.currentPlayer.activeUnit.tile :
                game.map.get(0, 0);
        }

        renderer.portal.centerX = parseInt(renderer.portal.width / 2);
        renderer.portal.centerY = parseInt(renderer.portal.height / 2);

        var tileSize = renderer.center.terrain.size * game.scale,
        layerWidth = game.map.width * tileSize,
        centerX = (renderer.center.x * tileSize) + parseInt(tileSize / 2),
        startX = renderer.portal.centerX - centerX,
        endX = renderer.portal.centerX + layerWidth,
        layerHeight = game.map.height * tileSize,
        centerY = (renderer.center.y * tileSize) + parseInt(tileSize / 2),
        startY = renderer.portal.centerY - centerY,
        endY = renderer.portal.centerY + layerHeight;

        while (startX > 0) {
            startX -= layerWidth;
        }

        while (startY > 0) {
            startY -= layerHeight;
        }

        while (endX < renderer.portal.width) {
            endX += layerWidth;
        }

        while (endY < renderer.portal.height) {
            endY += layerHeight;
        }

        (layersToProcess || renderer.layerOrder).forEach(function(layer) {
            for (var x = startX; x < endX; x += layerWidth * game.scale) {
                for (var y = startY; y < endY; y += layerHeight * game.scale) {
                    renderer.portalContext.drawImage(renderer.layers[layer], x, y, layerWidth * game.scale, layerHeight * game.scale);
                }
            }
        });

        renderer.context.drawImage(renderer.portal, 0, 0);
    }
};

// global.BaseRenderer.Layer = class BaseLayer extends Layer {
BaseRenderer.Layer = class BaseLayer {
    constructor(details) {
        var layer = this;

        extend(layer, details);

        layer.tileSize = game.map.terrainTypes[0].size;

        layer.canvas = document.createElement('canvas');
        layer.width = layer.canvas.width = game.map.width * layer.tileSize;
        layer.height = layer.canvas.height = game.map.height * layer.tileSize;
        layer.context = layer.canvas.getContext('2d');
        layer.images = {};

        layer.tiles.forEach(function(tile) {
            tile.images = (tile.images || []).map(function(image) {
                if (typeof image !== 'string') {
                    return image;
                }

                if (!(image in layer.images)) {
                    layer.images[image] = new global.Image();
                    layer.images[image].src = 'file://' + image;
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
                layer.context.drawImage(image, tile.x + (Math.floor((tile.width - image.width) / 2)), tile.y + (Math.floor((tile.height - image.height) / 2)), image.width, image.height);
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

// utility
BaseRenderer.Extract = {
    data: game.loadJSON(__path + 'extract-data.json'),
    images: [],
    loadImages: function() {
        ['SP257.gif', 'TER257.gif'].forEach(function(file) {
            var image = new global.Image();
            image.src = 'file://' + __path + file;

            BaseRenderer.Extract.images.push({
                element: image,
                file: file
            });
        });
    },
    run: function() {
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

        BaseRenderer.Extract.images.forEach(function(image) {
            Object.keys(BaseRenderer.Extract.data.files[image.file]).forEach(function(path) {
                var definitions = BaseRenderer.Extract.data.files[image.file][path];

                definitions.forEach(function(definition) {
                    definition.contents.forEach(function(content) {
                        var object = extend({}, BaseRenderer.Extract.data.defaults, definition, content),
                        filename = __path + 'assets/' + path + object.name + '.gif',
                        dirname = filename.replace(/\/[^\/]+$/, '/');

                        canvas.width = object.width;
                        canvas.height = object.height;
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(image.element, -object.x, -object.y);

                        for (var x = 0; x < canvas.width; x++) {
                            for (var y = 0; y < canvas.height; y++) {
                                var imageData = context.getImageData(x, y, 1, 1).data;

                                if (imageData[0] == object.clear.r && imageData[1] == object.clear.g && imageData[2] == object.clear.b) {
                                    context.clearRect(x, y, 1, 1);
                                }
                            }
                        }

                        // ensure assets directory exists
                        try {
                            fs.accessSync(__path + 'assets/', fs.F_OK);
                        }
                        catch (e) {
                            fs.mkdirSync(__path + 'assets/');
                        };

                        try {
                            fs.accessSync(dirname, fs.F_OK);
                        }
                        catch (e) {
                            fs.mkdirSync(dirname);
                        };

                        var buffer = new Buffer(canvas.toDataURL('image/gif').split(/,/)[1], 'base64');

                        fs.writeFileSync(filename, buffer);
                    });
                });
            });
        });
    }
};

global.renderer = new BaseRenderer();

game.on('start', function() {
    global.renderer.init();
});
