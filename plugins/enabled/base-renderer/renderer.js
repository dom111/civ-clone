'use strict';

var _stringToNode = (html) => ((el) => {
    el.innerHTML = html;

    return el.firstChild;
})(document.createElement('div'));

// TODO: renderer base class - set up prototype method that must be implemented?
// global.BaseRenderer = class BaseRenderer extends Renderer {
var BaseRenderer = class BaseRenderer {
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
    }

    init() {
        var renderer = this;

        renderer.addToBody(engine.template(Engine.Plugin.filter({type: 'template', package: 'base-renderer', label: 'layout'})[0].contents[0]));

        renderer.preload = document.getElementById('preload');

        Engine.Plugin.filter({type: 'asset', package: 'base-renderer'}).forEach((component) => component.contents.forEach((assetPath) => renderer.preload.innerHTML += '<img src="file://' + assetPath + '"/>'));

        renderer.canvas = document.getElementById('display');
        renderer.context = renderer.canvas.getContext('2d');

        renderer.canvas.addEventListener('mousedown', (event) => {
            var x = event.pageX,
            y = event.pageY,
            tileSize = engine.map.get(0, 0).terrain.size * engine.scale;

            x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
            y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

            x = parseInt(x / tileSize);
            y = parseInt(y / tileSize);

            x = renderer.center.x + x;
            y = renderer.center.y + y;

            var tile = engine.map.get(x, y);

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

        renderer.canvas.addEventListener('mousemove', (event) => {
            if (event.shiftKey) {
                var x = event.pageX,
                y = event.pageY,
                tileSize = engine.map.get(0, 0).terrain.size * engine.scale;

                x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
                y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

                x = parseInt(x / tileSize);
                y = parseInt(y / tileSize);

                x = renderer.center.x + x;
                y = renderer.center.y + y;

                var tile = engine.map.get(x, y);
                console.log(tile.x, tile.y);
            }
        });

        // TODO: throttle
        addEventListener('resize', () => {
            renderer.canvas.height = window.innerHeight;
            renderer.canvas.width = window.innerWidth;

            engine.emit('build-layer', 'all');
            engine.emit('update-display');
        });

        engine.on('build-layer', (layer) => renderer.buildLayer(layer || 'all'));

        engine.on('update-display', (layersToProcess) => renderer.updateDisplay(layersToProcess));

        renderer.hideFlag = false;
        renderer.interval = setInterval(() => {
            engine.emit('update-display', renderer.layerOrder.filter((layer) => {
                if ((layer === 'activeUnits') && renderer.hideFlag) {
                    return false;
                }

                return true;
            }));

            renderer.hideFlag = !renderer.hideFlag;

            // TODO: pallette cycling for coast/river animations
        }, 125);

        document.body.style.cursor = 'url("' + Engine.Plugin.getPath('base-renderer') + 'assets/cursor/torch.gif"), auto';

        engine.on('tile-improvement-built', (tile, improvement) => {
            if (improvement === 'irrigation') {
                engine.emit('build-layer', improvement);
            }
            else {
                engine.emit('build-layer', 'otherImprovements');
            }
        });

        engine.on('tile-improvement-pillaged', (tile, improvement) => {
            if (improvement === 'irrigation') {
                engine.emit('build-layer', improvement);
            }
            else {
                engine.emit('build-layer', 'otherImprovements');
            }
        });

        engine.on('tile-seen', (tile) => engine.emit('build-layer', 'visibility'));

        engine.on('city-created', (city) => engine.emit('build-layer', 'cities'));
        engine.on('city-grow', (city) => engine.emit('build-layer', 'cities'));
        engine.on('city-captured', (city) => engine.emit('build-layer', 'cities'));
        engine.on('city-destroyed', (city) => engine.emit('build-layer', 'cities'));

        engine.on('unit-created', (unit) => {
            engine.emit('build-layer', 'units');
            engine.emit('build-layer', 'activeUnits');
        });

        engine.on('unit-activate', (unit) => {
            if (!renderer.tileIsVisible(unit.tile)) {
                renderer.center = unit.tile;
            }

            engine.emit('build-layer', 'units');
            engine.emit('build-layer', 'activeUnits');
        });

        engine.on('unit-moved', (unit) => {
            engine.emit('build-layer', 'units');
            engine.emit('build-layer', 'activeUnits');
        });

        engine.on('unit-destroyed', (unit) => {
            engine.emit('build-layer', 'units');
            engine.emit('build-layer', 'activeUnits');
        });

        engine.on('turn-start', (unit) => {
            engine.emit('build-layer');
            engine.emit('update-display');
        });

        engine.on('player-turn-start', (unit) => {
            engine.emit('build-layer');
            engine.emit('update-display');
        });

        engine.on('turn-over', (unit) => {
            engine.emit('build-layer', 'units');
            engine.emit('build-layer', 'activeUnits');
        });

        engine.emit('bind-key', 'unit', 'c', () => {
            if (engine.currentPlayer && engine.currentPlayer.activeUnit) {
                renderer.center = engine.currentPlayer.activeUnit.tile;
            }
        });

        renderer.canvas.height = window.innerHeight;
        renderer.canvas.width = window.innerWidth;

        engine.emit('build-layer');
        engine.emit('update-display');
    }

    addToBody(element) {
        if (typeof element === 'string') {
            element = _stringToNode(element);
        }

        document.body.appendChild(element);

        return element;
    }

    buildLayer(layer) {
        var renderer = this;

        if (layer === 'land' || layer === 'all') {
            var tiles = [];

            engine.map.map.forEach((row) => {
                row.forEach((tile) => {
                    tiles.push({
                        images: (() => {
                            var images = [];

                            if (tile.isOcean) {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/ocean.gif');
                            }
                            else if (tile.isLand) {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/land.gif');
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

            engine.map.map.forEach((row) => {
                row.forEach((tile) => {
                    if (tile.improvements.includes('irrigation')) {
                        tiles.push({
                            images: [Engine.Plugin.getPath('base-renderer') + 'assets/improvements/irrigation.gif'],
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

            engine.map.map.forEach((row) => {
                row.forEach((tile) => {
                    var images = [];

                    if (tile.isOcean) {
                        if (tile.isCoast) {
                            var sprite = new global.Image();
                            sprite.src = Engine.Plugin.getPath('base-renderer') + 'assets/terrain/coast_sprite.gif';
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

                            ['n', 'e', 's', 'w']
                                .filter((direction) => (tile.adjacent[direction].terrain.name === 'river'))
                                .forEach((direction) => images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/river_mouth_' + direction + '.gif'));
                        }

                        if (tile.terrain.special) {
                            images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/' + tile.terrain.special.name + '.gif');
                        }
                    }
                    else {
                        if (tile.terrain.name === 'river') {
                            var adjoining = ['n', 'e', 's', 'w'].filter((direction) => (tile.adjacent[direction].isOcean || (tile.adjacent[direction].terrainId === tile.terrainId))).join('');

                            if (adjoining) {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/' + tile.terrain.name + '_' + adjoining + '.gif');
                            }
                            else {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/' + tile.terrain.name + '.gif');
                            }
                        }
                        else {
                            var adjoining = tile.adjacentTerrain;

                            if (adjoining) {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/' + tile.terrain.name + '_' + adjoining + '.gif');
                            }
                            else {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/' + tile.terrain.name + '.gif');
                            }

                            if (tile.terrain.special) {
                                images.push(Engine.Plugin.getPath('base-renderer') + 'assets/terrain/' + tile.terrain.special.name + '.gif');
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

            engine.map.map.forEach((row) => {
                row.forEach((tile) => {
                    var otherImprovements = tile.improvements.filter((improvement) => improvement !== 'irrigation');

                    if (otherImprovements.length) {
                        tiles.push({
                            images: (() => {
                                var images = [];

                                otherImprovements.forEach((improvement) => {
                                    if (improvement === 'road' && !otherImprovements.includes('railroad')) {
                                        var adjoining = Object.keys(tile.neighbours).filter((direction) => tile.neighbours[direction].improvements.includes('road'));

                                        if (adjoining.length) {
                                            adjoining.forEach((direction) => images.push(Engine.Plugin.getPath('base-renderer') + 'assets/improvements/' + improvement + '_' + direction + '.gif'));
                                        }
                                        else {
                                            images.push(Engine.Plugin.getPath('base-renderer') + 'assets/improvements/' + improvement + '.gif');
                                        }
                                    }
                                    else if (improvement === 'railroad') {
                                        var adjoining = Object.keys(tile.neighbours).filter((direction) => tile.neighbours[direction].improvements.includes('road'));

                                        if (adjoining.length) {
                                            adjoining.forEach((direction) => images.push(Engine.Plugin.getPath('base-renderer') + 'assets/improvements/' + improvement + '_' + direction + '.gif'));
                                        }
                                        else {
                                            images.push(Engine.Plugin.getPath('base-renderer') + 'assets/improvements/' + improvement + '.gif');
                                        }
                                    }
                                    else {
                                        images.push(Engine.Plugin.getPath('base-renderer') + 'assets/improvements/' + improvement + '.gif');
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

            engine.map.map.forEach((row) => {
                row.forEach((tile) => {
                    if (!engine.currentPlayer || !engine.currentPlayer.activeUnit || engine.currentPlayer.activeUnit.tile !== tile) {
                        var unit = tile.units.sort((a, b) => a.defence > b.defence ? -1 : a.defence == a.defence ? 0 : 1)[0],
                        images = [];

                        if (tile.units.length) {
                            var image = document.createElement('canvas'),
                            imageContext = image.getContext('2d'),
                            unitImage = new global.Image();
                            unitImage.src = 'file://' + Engine.Plugin.getPath('base-renderer') + 'assets/units/' + unit.name + '.gif'; // TODO: have each unit details as a component
                            image.width = unit.width;
                            image.height = unit.height;

                            if (tile.units.length > 1) {
                                image.width = unitImage.width + 1;
                                image.height = unitImage.height + 1;
                                imageContext.drawImage(unitImage, 1, 1);
                            }

                            imageContext.drawImage(unitImage, 0, 0);
                            imageContext.save();

                            images.push(image);

                            if (images.length) {
                                var sourceColors = Engine.Plugin.filter({type: 'asset', label: 'units'})[0].sourceColors,
                                replaceColors = unit.player.colors;

                                tiles.push({
                                    images: images.map((image) => renderer.replaceColor(image, sourceColors, replaceColors)),
                                    // text: unit.busy ? unit.currentAction.key.toUpperCase() : '',
                                    height: unit.height,
                                    width: unit.width,
                                    x: (unit.tile.terrain.size * unit.tile.x) + unit.offsetX,
                                    y: (unit.tile.terrain.size * unit.tile.y) + unit.offsetY
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

            engine.players.forEach((player) => {
                player.cities.forEach((city) => {
                    var image = document.createElement('canvas'),
                    imageContext = image.getContext('2d'),
                    cityImage = new global.Image();
                    cityImage.src = 'file://' + Engine.Plugin.getPath('base-renderer') + 'assets/map/city.gif';
                    replaceColors = city.player.colors;
                    image.width = city.tile.terrain.size;
                    image.height = city.tile.terrain.size;
                    imageContext.beginPath();
                    imageContext.rect(0, 0, city.tile.terrain.size, city.tile.terrain.size);
                    imageContext.fillStyle = replaceColors[0];
                    imageContext.fill();
                    imageContext.drawImage(cityImage, 0, 0);

                    image = renderer.replaceColor(image, ['#000'], [replaceColors[1]])

                    tiles.push({
                        images: [image],
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

            if (engine.currentPlayer && engine.currentPlayer.activeUnit) {
                var unit = engine.currentPlayer.activeUnit,
                tile = unit.tile,
                images = [];

                if (tile.units.length) {
                    var image = document.createElement('canvas'),
                    imageContext = image.getContext('2d'),
                    unitImage = new global.Image();
                    unitImage.src = 'file://' + Engine.Plugin.getPath('base-renderer') + 'assets/units/' + unit.name + '.gif';
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
                        var sourceColors = Engine.Plugin.filter({package: 'base-renderer', type: 'asset', label: 'units'})[0].sourceColors;
                        var replaceColors = engine.currentPlayer.colors;

                        tiles.push({
                            images: images.map((image) => renderer.replaceColor(image, sourceColors, replaceColors)),
                            // text: unit.busy ? unit.currentAction.key.toUpperCase() : '',
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
            player;

            if (engine.currentPlayer) {
                player = engine.currentPlayer;

                engine.map.map.forEach((row) => {
                    row.forEach((tile) => {
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

                            ['n', 'e', 's', 'w'].forEach((direction) => {
                                if (!tile.adjacent[direction].isVisible(player.id)) {
                                    images.push(Engine.Plugin.getPath('base-renderer') + 'assets/map/fog_' + direction + '.gif');
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
        }

        renderer.updateDisplay();
    }

    replaceColor(canvas, source, replacement) {
        var context = canvas.getContext('2d');
        context.save();
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var _getColor = (input) => {
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
            sourceColors.forEach((color, n) => {
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

        engine.scale = engine.scale || 1;

        if (!renderer.center) {
            renderer.center = engine.currentPlayer && engine.currentPlayer.activeUnit ?
                engine.currentPlayer.activeUnit.tile :
                engine.map.get(0, 0);
        }

        renderer.portal.centerX = parseInt(renderer.portal.width / 2);
        renderer.portal.centerY = parseInt(renderer.portal.height / 2);

        var tileSize = renderer.center.terrain.size * engine.scale,
        layerWidth = engine.map.width * tileSize,
        centerX = (renderer.center.x * tileSize) + parseInt(tileSize / 2),
        startX = renderer.portal.centerX - centerX,
        endX = renderer.portal.centerX + layerWidth,
        layerHeight = engine.map.height * tileSize,
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

        (layersToProcess || renderer.layerOrder).forEach((layer) => {
            for (var x = startX; x < endX; x += layerWidth * engine.scale) {
                for (var y = startY; y < endY; y += layerHeight * engine.scale) {
                    if (renderer.layers[layer]) {
                        renderer.portalContext.drawImage(renderer.layers[layer], x, y, layerWidth * engine.scale, layerHeight * engine.scale);
                    }
                }
            }
        });

        renderer.context.drawImage(renderer.portal, 0, 0);
    }

    // this fuzzes the visibility to be within 75% of visible space
    tileIsVisible(tile) {
        return (Math.abs(renderer.center.x - tile.x) < 20) && (Math.abs(renderer.center.y - tile.y) < 20);
    }
};

// global.BaseRenderer.Layer = class BaseLayer extends Layer {
BaseRenderer.Layer = class BaseLayer {
    constructor(details) {
        var layer = this;

        extend(layer, details);

        layer.tileSize = engine.map.terrainTypes[0].size;

        layer.canvas = document.createElement('canvas');
        layer.width = layer.canvas.width = engine.map.width * layer.tileSize;
        layer.height = layer.canvas.height = engine.map.height * layer.tileSize;
        layer.context = layer.canvas.getContext('2d');
        layer.images = {};

        layer.tiles.forEach((tile) => {
            tile.images = (tile.images || []).map((image) => {
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

        layer.tiles.forEach((tile) => {
            if (tile.background) {
                layer.context.fillStyle = tile.background;
                layer.context.fillRect(tile.x, tile.y, tile.width, tile.height);
            }

            tile.images.forEach((image) => {
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
// BaseRenderer.Extract = {
//     data: engine.loadJSON(Engine.Plugin.getPath('base-renderer') + 'extract-data.json'),
//     images: [],
//     loadImages: () => {
//         ['SP257.gif', 'TER257.gif'].forEach((file) => {
//             var image = new global.Image();
//             image.src = 'file://' + Engine.Plugin.getPath('base-renderer') + file;

//             BaseRenderer.Extract.images.push({
//                 element: image,
//                 file: file
//             });
//         });
//     },
//     run: () => {
//         var canvas = document.createElement('canvas'),
//         context = canvas.getContext('2d');

//         BaseRenderer.Extract.images.forEach((image) => {
//             Object.keys(BaseRenderer.Extract.data.files[image.file]).forEach((path) => {
//                 var definitions = BaseRenderer.Extract.data.files[image.file][path];

//                 definitions.forEach((definition) => {
//                     definition.contents.forEach((content) => {
//                         var object = extend({}, BaseRenderer.Extract.data.defaults, definition, content),
//                         filename = Engine.Plugin.getPath('base-renderer') + 'assets/' + path + object.name + '.gif',
//                         dirname = filename.replace(/\/[^\/]+$/, '/');

//                         canvas.width = object.width;
//                         canvas.height = object.height;
//                         context.clearRect(0, 0, canvas.width, canvas.height);
//                         context.drawImage(image.element, -object.x, -object.y);

//                         for (var x = 0; x < canvas.width; x++) {
//                             for (var y = 0; y < canvas.height; y++) {
//                                 var imageData = context.getImageData(x, y, 1, 1).data;

//                                 if (imageData[0] == object.clear.r && imageData[1] == object.clear.g && imageData[2] == object.clear.b) {
//                                     context.clearRect(x, y, 1, 1);
//                                 }
//                             }
//                         }

//                         // ensure assets directory exists
//                         try {
//                             fs.accessSync(Engine.Plugin.getPath('base-renderer') + 'assets/', fs.F_OK);
//                         }
//                         catch (e) {
//                             fs.mkdirSync(Engine.Plugin.getPath('base-renderer') + 'assets/');
//                         };

//                         try {
//                             fs.accessSync(dirname, fs.F_OK);
//                         }
//                         catch (e) {
//                             fs.mkdirSync(dirname);
//                         };

//                         var buffer = new Buffer(canvas.toDataURL('image/gif').split(/,/)[1], 'base64');

//                         fs.writeFileSync(filename, buffer);
//                     });
//                 });
//             });
//         });
//     }
// };

global.renderer = new BaseRenderer();

engine.on('start', () => global.renderer.init());
