'use strict';

import Engine from '../../../app/engine.js';

let _stringToNode = (html) => ((el) => {
    el.innerHTML = html;

    return el.firstChild;
})(document.createElement('div'));

// TODO: renderer base class - set up prototype method that must be implemented?
// let BaseRenderer = class BaseRenderer extends Renderer {
export class BaseRenderer {
    #engine;

    constructor(engine) {
        let renderer = this;

        renderer.layerOrder = [
            'land',
            'irrigation',
            'baseTerrain',
            'otherImprovements',
            'units',
            'cities',
            'activeUnits',
            'visibility',
            'activeVisibility'
        ];

        renderer.layers = {};

        this.#engine = engine;
        this.#oldEngine = new Engine();
        this.binCoreEvents();
    }

    binCoreEvents() {
        this.#engine.on('world:built', (map) => this.#map = map);
    }

    init() {
        let renderer = this;

        renderer.addToBody(this.#oldEngine.template(this.#oldEngine.getAsset({type: 'template', package: 'base-renderer', label: 'layout'})));

        if (global.debug) {
            renderer.addToBody(this.#oldEngine.template(this.#oldEngine.getAsset({type: 'template', package: 'base-renderer', label: 'debug'}), renderer));

            let layerDebug = document.getElementById('layerDebug');
            Array.from(layerDebug.querySelectorAll('input[type="checkbox"]')).forEach((el) => {
                el.addEventListener('change', (event) => {
                    renderer.layerOrder = Array.from(layerDebug.querySelectorAll('input[type="checkbox"]')).filter((el) => el.checked).map((el) => el.name);
                });
            });
        }

        renderer.preload = document.getElementById('preload');

        // Engine.Plugin.filter({type: 'asset', package: 'base-renderer'}).forEach((component) => component.contents.forEach((assetPath) => renderer.preload.innerHTML += '<img src="file://' + assetPath + '" data-path="' + assetPath + '"/>')); // TODO: added preloaded images manually - prevents load timeout, this sucks though...

        renderer.canvas = document.getElementById('display');
        renderer.context = renderer.canvas.getContext('2d');

        renderer.canvas.addEventListener('mousedown', (event) => {
            let x = event.pageX,
            y = event.pageY,
            tileSize = 16 * this.#oldEngine.scale;

            x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
            y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

            x = parseInt(x / tileSize);
            y = parseInt(y / tileSize);

            x = renderer.center.x + x;
            y = renderer.center.y + y;

            let tile = this.#get(x, y);

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
                let x = event.pageX,
                y = event.pageY,
                tileSize = 16 * this.#oldEngine.scale;

                x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
                y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

                x = parseInt(x / tileSize);
                y = parseInt(y / tileSize);

                x = renderer.center.x + x;
                y = renderer.center.y + y;

                let tile = this.#get(x, y);
                console.log(tile.x, tile.y);
            }
        });

        // TODO: throttle
        addEventListener('resize', () => {
            renderer.canvas.height = window.innerHeight;
            renderer.canvas.width = window.innerWidth;

            this.#oldEngine.emit('build-layer');
            this.#oldEngine.emit('update-display');
        });

        this.#engine.on('build-layer', (layer) => renderer.buildLayer(layer || 'all'));

        this.#oldEngine.on('update-display', (layersToProcess) => renderer.updateDisplay(layersToProcess));

        renderer.hideFlag = false;
        // TODO: request animation frame?
        renderer.interval = setInterval(() => {
            this.#oldEngine.emit('update-display', renderer.layerOrder.filter((layer) => {
                if ((layer === 'activeUnits') && renderer.hideFlag) {
                    return false;
                }

                return true;
            }));

            renderer.hideFlag = !renderer.hideFlag;

            // TODO: pallette cycling for coast/river animations
        }, 125);

        this.#engine.on('tile:improvement-built', (tile, improvement) => {
            if (improvement === 'irrigation') {
                this.#engine.emit('build-layer', improvement);
            }
            else {
                this.#engine.emit('build-layer', 'otherImprovements');
            }
        });

        this.#engine.on('tile:improvement-pillaged', (tile, improvement) => {
            if (improvement === 'irrigation') {
                this.#engine.emit('build-layer', improvement);
            }
            else {
                this.#engine.emit('build-layer', 'otherImprovements');
            }
        });

        this.#engine.on('tile:seen', (tile) => this.#engine.emit('build-layer', 'visibility'));

        this.#engine.on('city:created', (city) => this.#engine.emit('build-layer', 'cities'));
        this.#engine.on('city:grow', (city) => this.#engine.emit('build-layer', 'cities'));
        this.#engine.on('city:captured', (city) => this.#engine.emit('build-layer', 'cities'));
        this.#engine.on('city:destroyed', (city) => this.#engine.emit('build-layer', 'cities'));

        this.#engine.on('unit:activate', (unit) => {
            if (!renderer.tileIsVisible(unit.tile)) {
                renderer.center = unit.tile;
            }
        });

        ['unit:moved', 'unit:activate', 'unit:created', 'unit:destroyed', 'unit:action'].forEach((event) => {
            this.#engine.on(event, (unit) => {
                this.#engine.emit('build-layer', 'units');
                this.#engine.emit('build-layer', 'activeUnits');
                this.#engine.emit('build-layer', 'activeVisibility');
            });
        });

        this.#engine.on('player-turn-start', (unit) => {
            this.#engine.emit('build-layer', 'visibility');
        });

        this.#engine.emit('bind-key', 'unit', 'c', () => {
            if (this.#oldEngine.currentPlayer && this.#oldEngine.currentPlayer.activeUnit) {
                renderer.center = this.#oldEngine.currentPlayer.activeUnit.tile;
            }
        });

        renderer.canvas.height = window.innerHeight;
        renderer.canvas.width = window.innerWidth;

        this.#engine.emit('build-layer');
    }

    addToBody(element) {
        if (typeof element === 'string') {
            element = _stringToNode(element);
        }

        document.body.appendChild(element);

        return element;
    }

    buildLayer(layer) {
        let renderer = this,
        tiles = {};

        this.#map.getBy(() => true).forEach((tile) => {
                if ((layer === 'land') || (layer === 'all')) {
                    if (!('land' in tiles)) {
                        tiles.land = [];
                    }

                    tiles.land.push({
                        images: (() => {
                            let images = [];

                            if (tile.isOcean) {
                                images.push(renderer._getPreloadedImage('assets/terrain/Ocean.png'));
                            }
                            else if (tile.isLand) {
                                images.push(renderer._getPreloadedImage('assets/terrain/Land.png'));
                            }
                            else {
                                console.log(`tile at ${tile.x}, ${tile.y} is not land or ocean...`);
                            }

                            return images;
                        })(),
                        height: 16,
                        width: 16,
                        x: 16 * tile.x,
                        y: 16 * tile.y
                    });
                }

                if (layer === 'irrigation' || layer === 'all') {
                    if (!('irrigation' in tiles)) {
                        tiles.irrigation = [];
                    }

                    if (tile.improvements.some((improvement) => improvement.constructor.name === 'Irrigation')) {
                        tiles.irrigation.push({
                            images: [renderer._getPreloadedImage('assets/improvements/Irrigation.png')],
                            height: 16,
                            width: 16,
                            x: 16 * tile.x,
                            y: 16 * tile.y
                        });
                    }
                }

                if (layer === 'baseTerrain' || layer === 'all') {
                    if (!('baseTerrain' in tiles)) {
                        tiles.baseTerrain = [];
                    }

                    let images = [];

                    if (tile.isOcean) {
                        if (tile.isCoast) {
                            let sprite = renderer._getPreloadedImage('assets/terrain/coast_sprite.png'),
                            image = renderer._createPreloadCanvas(),
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
                                let topLeftSubtileOffset = (bitmask & 7),
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
                                .forEach((direction) => images.push(renderer._getPreloadedImage('assets/terrain/river_mouth_' + direction + '.png')));
                        }

                        if (tile.terrain.special) {
                            images.push(renderer._getPreloadedImage('assets/terrain/' + tile.terrain.feature.constructor.name + '.png'));
                        }
                    }
                    else {
                        if (tile.terrain.constructor.name === 'River') {
                            let adjoining = ['n', 'e', 's', 'w'].filter((direction) => (tile.getNeighbour(direction).isOcean() || (tile.getNeighbour(direction).terrain.constructor.name === 'River'))).join('');

                            if (adjoining) {
                                images.push(renderer._getPreloadedImage('assets/terrain/' + tile.terrain.constructor.name + '_' + adjoining + '.png'));
                            }
                            else {
                                images.push(renderer._getPreloadedImage('assets/terrain/' + tile.terrain.constructor.name + '.png'));
                            }
                        }
                        else {
                            let adjoining = tile.adjacentTerrain;

                            if (adjoining) {
                                images.push(renderer._getPreloadedImage('assets/terrain/' + tile.terrain.constructor.name + '_' + adjoining + '.png'));
                            }
                            else {
                                images.push(renderer._getPreloadedImage('assets/terrain/' + tile.terrain.constructor.name + '.png'));
                            }

                            if (tile.terrain.features.length) {
                                images.push(renderer._getPreloadedImage('assets/terrain/' + tile.terrain.features.map((feature) => feature.constructor.name)[0] + '.png'));
                            }
                        }
                    }

                    if (images.length && images[0]) {
                        tiles.baseTerrain.push({
                            images: images,
                            height: 16,
                            width: 16,
                            x: 16 * tile.x,
                            y: 16 * tile.y
                        });
                    }
                }

                if (layer === 'otherImprovements' || layer === 'all') {
                    if (!('otherImprovements' in tiles)) {
                        tiles.otherImprovements = [];
                    }

                    let otherImprovements = tile.improvements.filter((improvement) => improvement.constructor.name !== 'Irrigation');

                    if (otherImprovements.length) {
                        tiles.otherImprovements.push({
                            images: (() => {
                                let images = [],
                                adjoining;

                                otherImprovements.forEach((improvement) => {
                                    if (improvement.constructor.name === 'Road'/* && !otherImprovements.includes('railroad')*/) {
                                        adjoining = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].filter((direction) => tile.getNeighbor(direction).improvements.some((improvement) => improvement.constructor.name === 'Road'));

                                        if (adjoining.length) {
                                            adjoining.forEach((direction) => images.push(renderer._getPreloadedImage('assets/improvements/' + improvement.constructor.name + '_' + direction + '.png')));
                                        }
                                        else {
                                            images.push(renderer._getPreloadedImage('assets/improvements/' + improvement.constructor.name + '.png'));
                                        }
                                    }
                                    // else if (improvement === 'railroad') {
                                    //     adjoining = Object.keys(tile.neighbours).filter((direction) => tile.neighbours[direction].improvements.includes('road'));
                                    //
                                    //     if (adjoining.length) {
                                    //         adjoining.forEach((direction) => images.push(renderer._getPreloadedImage('assets/improvements/' + improvement + '_' + direction + '.png')));
                                    //     }
                                    //     else {
                                    //         images.push(renderer._getPreloadedImage('assets/improvements/' + improvement.constructor.name + '.png'));
                                    //     }
                                    // }
                                    else {
                                        images.push(renderer._getPreloadedImage('assets/improvements/' + improvement.constructor.name + '.png'));
                                    }
                                });

                                return images;
                            })(),
                            height: 16,
                            width: 16,
                            x: 16 * tile.x,
                            y: 16 * tile.y
                        });
                    }
                }

                if (layer === 'units' || layer === 'all') {
                    if (!('units' in tiles)) {
                        tiles.units = [];
                    }

                    if (tile.units.length) {
                        // if (!this.#oldEngine.currentPlayer || !this.#oldEngine.currentPlayer.activeUnit || !tile.units.includes(this.#oldEngine.currentPlayer.activeUnit)) {
                            let unit = tile.units.sort((a, b) => b.defence - a.defence)[0],
                            image = renderer._createPreloadCanvas(),
                            imageContext = image.getContext('2d'),
                            unitImage = renderer._getPreloadedImage('assets/units/' + unit.constructor.name + '.png'), // TODO: have each unit details as a component
                            sourceColors = Engine.Plugin.filter({type: 'asset', label: 'units'})[0].sourceColors,
                            replaceColors = unit.player.colors;

                            image.width = unitImage.width;
                            image.height = unitImage.height;

                            if (tile.units.length > 1) {
                                image.width = unitImage.width + 1;
                                image.height = unitImage.height + 1;
                                imageContext.drawImage(unitImage, 1, 1);
                            }

                            imageContext.drawImage(unitImage, 0, 0);
                            imageContext.save();

                            image = renderer.replaceColor(image, sourceColors, replaceColors);

                            tiles.units.push({
                                images: [image],
                                text: unit.busy ? unit.currentAction.key.toUpperCase() : '',
                                height: unit.height,
                                width: unit.width,
                                x: (16 * unit.tile.x) + unit.offsetX,
                                y: (16 * unit.tile.y) + unit.offsetY
                            });
                        // }
                    }
                }

                if (layer === 'cities' || layer === 'all') {
                    if (!('cities' in tiles)) {
                        tiles.cities = [];
                    }

                    if (tile.city) {
                        let city = tile.city,
                        image = renderer._createPreloadCanvas(),
                        imageContext = image.getContext('2d'),
                        cityImage = renderer._getPreloadedImage('assets/map/city.png'),
                        replaceColors = city.player.colors;

                        image.width = 16;
                        image.height = 16;
                        imageContext.beginPath();
                        imageContext.rect(0, 0, 16, 16);
                        imageContext.fillStyle = replaceColors[0];
                        imageContext.fill();
                        imageContext.drawImage(cityImage, 0, 0);

                        image = renderer.replaceColor(image, ['#000'], [replaceColors[1]])

                        tiles.cities.push({
                            images: [image],
                            background: city.player.colour,
                            text: city.size,
                            textBelow: city.name,
                            height: 16,
                            width: 16,
                            x: 16 * city.tile.x,
                            y: 16 * city.tile.y
                        });
                    }
                }

                if (layer === 'activeUnits' || layer === 'all') {
                    if (!('activeUnits' in tiles)) {
                        tiles.activeUnits = [];
                    }

                    // TODO
                    if (this.#oldEngine.currentPlayer && this.#oldEngine.currentPlayer.activeUnit && tile.units.includes(this.#oldEngine.currentPlayer.activeUnit)) {
                        let unit = this.#oldEngine.currentPlayer.activeUnit,
                        tile = unit.tile,
                        image = renderer._createPreloadCanvas(),
                        imageContext = image.getContext('2d'),
                        unitImage = renderer._getPreloadedImage('assets/units/' + unit.constructor.name + '.png');

                        image.width = unitImage.width;
                        image.height = unitImage.height;

                        if (tile.units.length > 1) {
                            image.width = unitImage.width + 1;
                            image.height = unitImage.height + 1;
                            imageContext.drawImage(unitImage, 1, 1);
                        }

                        imageContext.drawImage(unitImage, 0, 0);
                        imageContext.save();

                        let sourceColors = Engine.Plugin.first({package: 'base-renderer', type: 'asset', label: 'units'}).sourceColors,
                        replaceColors = this.#oldEngine.currentPlayer.colors;

                        tiles.activeUnits.push({
                            images: [renderer.replaceColor(image, sourceColors, replaceColors)],
                            height: unit.height,
                            width: unit.width,
                            x: 16 * unit.tile.x,
                            y: 16 * unit.tile.y
                        });
                    }
                }

                if (layer === 'visibility' || layer === 'all') {
                    if (!('visibility' in tiles)) {
                        tiles.visibility = [];
                    }

                    let player;

                    if (this.#oldEngine.currentPlayer) {
                        player = this.#oldEngine.currentPlayer;

                        if (!tile.isVisible(player.id)) {
                            tiles.visibility.push({
                                background: '#000',
                                height: 16,
                                width: 16,
                                x: 16 * tile.x,
                                y: 16 * tile.y
                            });
                        }
                        else {
                            let images = [];

                            ['n', 'e', 's', 'w'].forEach((direction) => {
                                if (!tile.adjacent[direction].isVisible(player.id)) {
                                    images.push(renderer._getPreloadedImage('assets/map/fog_' + direction + '.png'));
                                }
                            });

                            if (images.length) {
                                tiles.visibility.push({
                                    images: images,
                                    height: 16,
                                    width: 16,
                                    x: 16 * tile.x,
                                    y: 16 * tile.y
                                });
                            }
                        }
                    }
                }

                if (layer === 'activeVisibility' || layer === 'all') {
                    if (!('activeVisibility' in tiles)) {
                        tiles.activeVisibility = [];
                    }

                    let player;

                    if (this.#oldEngine.currentPlayer) {
                        player = this.#oldEngine.currentPlayer;

                        if (!tile.isActivelyVisible(player.id)) {
                            tiles.activeVisibility.push({
                                background: '#000',
                                height: 16,
                                width: 16,
                                x: 16 * tile.x,
                                y: 16 * tile.y
                            });
                        }
                        else {
                            let images = [];

                            ['n', 'e', 's', 'w'].forEach((direction) => {
                                if (!tile.adjacent[direction].isActivelyVisible(player.id)) {
                                    images.push(renderer._getPreloadedImage('assets/map/fog_' + direction + '.png'));
                                }
                            });

                            if (images.length) {
                                tiles.activeVisibility.push({
                                    images: images,
                                    height: 16,
                                    width: 16,
                                    x: 16 * tile.x,
                                    y: 16 * tile.y
                                });
                            }
                        }
                    }
                }

                if (global.debug) {
                    if (!tiles.grid) {
                        tiles.grid = [];

                        let image = renderer._createPreloadCanvas(),
                        imageContext = image.getContext('2d');

                        image.width = 16;
                        image.height = 16;

                        imageContext.fillStyle = '#000';
                        imageContext.fillRect(0, 0, image.width, 1);
                        imageContext.fillRect(image.width, 0, image.width, image.height);
                        imageContext.fillRect(0, image.height, image.width, image.height);
                        imageContext.fillRect(0, 0, 1, image.height);

                        tiles.grid.push({
                            images: [image],
                            height: 16,
                            width: 16,
                            x: 16 * tile.x,
                            y: 16 * tile.y
                        });
                    }
                }
        });

        renderer.layerOrder.forEach((layerName) => {
            if ((layer === layerName) || (layer === 'all')) {
                let layerObject = new BaseRenderer.Layer({
                    name: layerName,
                    tiles: tiles[layerName]
                });

                renderer.layers[layerName] = layerObject.render();
            }
        });

        if (global.debug) {
            let dummyWhite = new BaseRenderer.Layer({
                name: 'dummyWhite',
                tiles: []
            });
            dummyWhite.context.fillStyle = '#fff';
            dummyWhite.context.fillRect(0, 0, dummyWhite.width, dummyWhite.height);
            renderer.layers.dummyWhite = dummyWhite.render();

            let dummyBlack = new BaseRenderer.Layer({
                name: 'dummyBlack',
                tiles: []
            });
            dummyBlack.context.fillStyle = '#000';
            dummyBlack.context.fillRect(0, 0, dummyBlack.width, dummyBlack.height);
            renderer.layers.dummyBlack = dummyBlack.render();
        }

        renderer.updateDisplay();
    }

    _createPreloadCanvas() {
        let renderer = this,
        canvas = document.createElement('canvas');

        renderer.preload.appendChild(canvas);

        return canvas;
    }

    _cleanupPreloadCanvas() {
        let renderer = this;

        Array.from(renderer.preload.querySelectorAll('canvas')).forEach((node) => {
            renderer.preload.removeChild(node);
        });

        return true;
    }

    _getPreloadedImage(path) {
        let renderer = this;

        if (!path.match(/^\//)) {
            path = Engine.Plugin.getPath('base-renderer') + path;
        }

        return renderer.preload.querySelector(`[data-path="${path}"]`);
    }

    replaceColor(canvas, source, replacement) {
        let context = canvas.getContext('2d');
        context.save();
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        let _getColor = (input) => {
            let match = [],
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

        let sourceColors = source.map(_getColor),
        replaceColors = replacement.map(_getColor);

        for (let i = 0; i < imageData.data.length; i += 4) {
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
        let renderer = this;

        renderer.portal = document.createElement('canvas');
        renderer.portal.width = window.innerWidth;
        renderer.portal.height = window.innerHeight;
        renderer.portalContext = renderer.portal.getContext('2d');

        this.#oldEngine.scale = this.#oldEngine.scale || 1;

        if (!renderer.center) {
            renderer.center = this.#oldEngine.currentPlayer && this.#oldEngine.currentPlayer.activeUnit ?
                this.#oldEngine.currentPlayer.activeUnit.tile :
                this.#get(0, 0);
        }

        renderer.portal.centerX = parseInt(renderer.portal.width / 2);
        renderer.portal.centerY = parseInt(renderer.portal.height / 2);

        let tileSize = 16 * this.#oldEngine.scale,
        layerWidth = this.#width * tileSize,
        centerX = (renderer.center.x * tileSize) + parseInt(tileSize / 2),
        startX = renderer.portal.centerX - centerX,
        endX = renderer.portal.centerX + layerWidth,
        layerHeight = this.#height * tileSize,
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
            for (let x = startX; x < endX; x += layerWidth * this.#oldEngine.scale) {
                for (let y = startY; y < endY; y += layerHeight * this.#oldEngine.scale) {
                    if (renderer.layers[layer]) {
                        renderer.portalContext.drawImage(renderer.layers[layer], x, y, layerWidth * this.#oldEngine.scale, layerHeight * this.#oldEngine.scale);
                    }
                }
            }
        });

        renderer.context.drawImage(renderer.portal, 0, 0);

        renderer._cleanupPreloadCanvas();
    }

    // it would be ideal if this could fuzz the visibility to be within 75% of visible space
    tileIsVisible(tile) {
        return (Math.abs(this.center.x - tile.x) < 20) && (Math.abs(this.center.y - tile.y) < 20);
    }
};

// to be used for assumptions on each layer
let layerDefaults = {
    activeVisibility: {
        globalAlpha: 0.33
    }
};

// global.BaseRenderer.Layer = class BaseLayer extends Layer {
BaseRenderer.Layer = class BaseLayer {
    constructor(details) {
        let layer = this;

        extend(layer, details);

        if (layer.name in layerDefaults) {
            extend(layer, layerDefaults[layer.name]);
        }

        layer.tileSize = 16;

        layer.canvas = document.createElement('canvas');
        layer.width = layer.canvas.width = this.#width * layer.tileSize;
        layer.height = layer.canvas.height = this.#height * layer.tileSize;
        layer.context = layer.canvas.getContext('2d');

        layer.tiles.forEach((tile) => {
            tile.images = (tile.images || []);
        });
    }

    render() {
        let layer = this;

        if (layer.globalAlpha) {
            layer.context.globalAlpha = layer.globalAlpha;
        }

        layer.tiles.forEach((tile) => {
            if (tile.background) {
                layer.context.fillStyle = tile.background;
                layer.context.fillRect(tile.x, tile.y, tile.width, tile.height);
            }

            tile.images.forEach((image) => {
                if (!image) {
                    // console.log(`image:${image}, name:${layer.name}, x:${tile.x}, y:${tile.y}`);
                }
                else {
                    layer.context.drawImage(image, tile.x + (Math.floor((tile.width - image.width) / 2)), tile.y + (Math.floor((tile.height - image.height) / 2)), image.width, image.height);
                }
            });

            if (tile.text) {
                layer.context.font = 'bold 10px sans-serif';
                layer.context.fillStyle = 'black';
                layer.context.textAlign="center";
                layer.context.fillText(tile.text, tile.x + 9, tile.y + 12);
                layer.context.font = 'bold 10px sans-serif';
                layer.context.fillStyle = 'white';
                layer.context.textAlign="center";
                layer.context.fillText(tile.text, tile.x + 8, tile.y + 11);
            }

            if (tile.textBelow) {
                layer.context.font = 'bold 10px sans-serif';
                layer.context.fillStyle = 'black';
                layer.context.textAlign="center";
                layer.context.fillText(tile.textBelow, tile.x + 8, tile.y + 28);
                layer.context.font = 'bold 10px sans-serif';
                layer.context.fillStyle = '#08E3EF';
                layer.context.textAlign="center";
                layer.context.fillText(tile.textBelow, tile.x + 7, tile.y + 27);
            }
        });

        return layer.canvas;
    }
};

export default BaseRenderer;
