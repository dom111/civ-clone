'use strict';

const _stringToNode = (html) => ((el) => {
  el.innerHTML = html;

  return el.firstChild;
})(document.createElement('div'));

// TODO: renderer base class - set up prototype method that must be implemented?
// let BaseRenderer = class BaseRenderer extends Renderer {
const BaseRenderer = class BaseRenderer {
  constructor() {
    const renderer = this;

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
  }

  init() {
    const renderer = this;

    renderer.addToBody(engine.template(engine.getAsset({type: 'template', package: 'base-renderer', label: 'layout'})));

    if (global.debug) {
      renderer.addToBody(engine.template(engine.getAsset({type: 'template', package: 'base-renderer', label: 'debug'}), renderer));

      const layerDebug = document.getElementById('layerDebug');

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
        tileSize = engine.map.get(0, 0).terrain.size * engine.scale;

      x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
      y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

      x = parseInt(x / tileSize);
      y = parseInt(y / tileSize);

      x = renderer.center.x + x;
      y = renderer.center.y + y;

      const tile = engine.map.get(x, y);

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
          tileSize = engine.map.get(0, 0).terrain.size * engine.scale;

        x -= parseInt(renderer.canvas.width / 2) - parseInt(tileSize / 2);
        y -= parseInt(renderer.canvas.height / 2) - parseInt(tileSize / 2);

        x = parseInt(x / tileSize);
        y = parseInt(y / tileSize);

        x = renderer.center.x + x;
        y = renderer.center.y + y;

        const tile = engine.map.get(x, y);

        console.log(tile.x, tile.y);
      }
    });

    // TODO: throttle
    addEventListener('resize', () => {
      renderer.canvas.height = window.innerHeight;
      renderer.canvas.width = window.innerWidth;

      engine.emit('build-layer');
      engine.emit('update-display');
    });

    engine.on('build-layer', (layer) => renderer.buildLayer(layer || 'all'));

    engine.on('update-display', (layersToProcess) => renderer.updateDisplay(layersToProcess));

    renderer.hideFlag = false;
    // TODO: request animation frame?
    renderer.interval = setInterval(() => {
      engine.emit('update-display', renderer.layerOrder.filter((layer) => {
        if ((layer === 'activeUnits') && renderer.hideFlag) {
          return false;
        }

        return true;
      }));

      renderer.hideFlag = ! renderer.hideFlag;

      // TODO: pallette cycling for coast/river animations
    }, 125);

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

    engine.on('unit-activate', (unit) => {
      if (! renderer.tileIsVisible(unit.tile)) {
        renderer.center = unit.tile;
      }
    });

    ['unit-moved', 'unit-activate', 'unit-created', 'unit-destroyed', 'unit-action'].forEach((event) => {
      engine.on(event, (unit) => {
        engine.emit('build-layer', 'units');
        engine.emit('build-layer', 'activeUnits');
        engine.emit('build-layer', 'activeVisibility');
      });
    });

    engine.on('player-turn-start', (unit) => {
      engine.emit('build-layer', 'visibility');
    });

    engine.emit('bind-key', 'unit', 'c', () => {
      if (engine.currentPlayer && engine.currentPlayer.activeUnit) {
        renderer.center = engine.currentPlayer.activeUnit.tile;
      }
    });

    renderer.canvas.height = window.innerHeight;
    renderer.canvas.width = window.innerWidth;

    engine.emit('build-layer');
  }

  addToBody(element) {
    if (typeof element === 'string') {
      element = _stringToNode(element);
    }

    document.body.appendChild(element);

    return element;
  }

  buildLayer(layer) {
    const renderer = this,
      tiles = {};

    engine.map.map.forEach((row) => {
      row.forEach((tile) => {
        if ((layer === 'land') || (layer === 'all')) {
          if (! ('land' in tiles)) {
            tiles.land = [];
          }

          tiles.land.push({
            images: (() => {
              const images = [];

              if (tile.isOcean()) {
                images.push(renderer._getPreloadedImage('assets/terrain/ocean.gif'));
              }
              else if (tile.isLand()) {
                images.push(renderer._getPreloadedImage('assets/terrain/land.gif'));
              }
              else {
                console.log(`tile at ${tile.x}, ${tile.y} is not land or ocean...`);
              }

              return images;
            })(),
            height: tile.terrain.size,
            width: tile.terrain.size,
            x: tile.terrain.size * tile.x,
            y: tile.terrain.size * tile.y
          });
        }

        if (layer === 'irrigation' || layer === 'all') {
          if (! ('irrigation' in tiles)) {
            tiles.irrigation = [];
          }

          if (TileImprovementRegistry.getInstance()
.getBy('tile', tile).includes('irrigation')) {
            tiles.irrigation.push({
              images: [renderer._getPreloadedImage('assets/improvements/irrigation.gif')],
              height: tile.terrain.size,
              width: tile.terrain.size,
              x: tile.terrain.size * tile.x,
              y: tile.terrain.size * tile.y
            });
          }
        }

        if (layer === 'baseTerrain' || layer === 'all') {
          if (! ('baseTerrain' in tiles)) {
            tiles.baseTerrain = [];
          }

          const images = [];

          if (tile.isOcean()) {
            if (tile.isCoast()) {
              const sprite = renderer._getPreloadedImage('assets/terrain/coast_sprite.gif'),
                image = renderer._createPreloadCanvas(),
                imageContext = image.getContext('2d'),

                // formula from: http://forums.civfanatics.com/showpost.php?p=13507808&postcount=40
                // Build a bit mask of all 8 surrounding tiles, setting the bit if the tile is not an
                // ocean tile. Starting with the tile to the left as the least significant bit and
                // going clockwise
                bitmask =
                  (! tile.getNeighbour('n').isOcean() ? 4 : 0) |
                  (! tile.getNeighbour('ne').isOcean() ? 8 : 0) |
                  (! tile.getNeighbour('e').isOcean() ? 16 : 0) |
                  (! tile.getNeighbour('se').isOcean() ? 32 : 0) |
                  (! tile.getNeighbour('s').isOcean() ? 64 : 0) |
                  (! tile.getNeighbour('sw').isOcean() ? 128 : 0) |
                  (! tile.getNeighbour('w').isOcean() ? 1 : 0) |
                  (! tile.getNeighbour('nw').isOcean() ? 2 : 0)
              ;

              image.width = image.height = 16;

              if (bitmask > 0) {
                // There are at least one surrounding tile that is not ocean, so we need to render
                // coast. We divide the tile into four 8x8 subtiles and for each of these we want
                // a 3 bit bitmask of the surrounding tiles. We do this by looking at the 3 least
                // significant bits for the top left subtile and shift the mask to the right as we
                // are going around the tile. This way we are "rotating" our bitmask. The result
                // are our x offsets into ter257.pic
                const topLeftSubtileOffset = (bitmask & 7),
                  topRightSubtileOffset = ((bitmask >> 2) & 7),
                  bottomRightSubtileOffset = ((bitmask >> 4) & 7),
                  bottomLeftSubtileOffset = ((bitmask >> 6) & 7) | ((bitmask & 1) << 2);

                imageContext.drawImage(sprite, topLeftSubtileOffset << 4, 0, 8, 8, 0, 0, 8, 8);
                imageContext.drawImage(sprite, (topRightSubtileOffset << 4) + 8, 0, 8, 8, 8, 0, 8, 8);
                imageContext.drawImage(sprite, (bottomRightSubtileOffset << 4) + 8, 8, 8, 8, 8, 8, 8, 8);
                imageContext.drawImage(sprite, bottomLeftSubtileOffset << 4, 8, 8, 8, 0, 8, 8, 8);
              }

              images.push(image);

              ['n', 'e', 's', 'w']
                .filter((direction) => (tile.getAdjacent()[direction].terrain.name === 'river'))
                .forEach((direction) => images.push(renderer._getPreloadedImage(`assets/terrain/river_mouth_${direction}.gif`)));
            }

            if (tile.terrain.special) {
              images.push(renderer._getPreloadedImage(`assets/terrain/${tile.terrain.special.name}.gif`));
            }
          }
          else {
            if (tile.terrain.name === 'river') {
              const adjoining = ['n', 'e', 's', 'w']
                .filter((direction) => (tile.getAdjacent()[direction].isOcean() || (tile.getAdjacent()[direction].terrain.name === tile.terrain.name)))
                .join('')
              ;

              if (adjoining) {
                images.push(renderer._getPreloadedImage(`assets/terrain/${tile.terrain.name}_${adjoining}.gif`));
              }
              else {
                images.push(renderer._getPreloadedImage(`assets/terrain/${tile.terrain.name}.gif`));
              }
            }
            else {
              const adjoining = tile.adjacentTerrain;

              if (adjoining) {
                images.push(renderer._getPreloadedImage(`assets/terrain/${tile.terrain.name}_${adjoining}.gif`));
              }
              else {
                images.push(renderer._getPreloadedImage(`assets/terrain/${tile.terrain.name}.gif`));
              }

              if (tile.terrain.special) {
                images.push(renderer._getPreloadedImage(`assets/terrain/${tile.terrain.special.name}.gif`));
              }
            }
          }

          if (images.length && images[0]) {
            tiles.baseTerrain.push({
              images: images,
              height: tile.terrain.size,
              width: tile.terrain.size,
              x: tile.terrain.size * tile.x,
              y: tile.terrain.size * tile.y
            });
          }
        }

        if (layer === 'otherImprovements' || layer === 'all') {
          if (! ('otherImprovements' in tiles)) {
            tiles.otherImprovements = [];
          }

          const otherImprovements = TileImprovementRegistry.getInstance()
.getBy('tile', tile).filter((improvement) => improvement !== 'irrigation');

          if (otherImprovements.length) {
            tiles.otherImprovements.push({
              images: (() => {
                let images = [],
                  adjoining;

                otherImprovements.forEach((improvement) => {
                  if (improvement === 'road' && ! otherImprovements.includes('railroad')) {
                    adjoining = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].filter((direction) => tile.getNeighbour(direction).improvements.includes('road'));

                    if (adjoining.length) {
                      adjoining.forEach((direction) => images.push(renderer._getPreloadedImage(`assets/improvements/${improvement}_${direction}.gif`)));
                    }
                    else {
                      images.push(renderer._getPreloadedImage(`assets/improvements/${improvement}.gif`));
                    }
                  }
                  else if (improvement === 'railroad') {
                    adjoining = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].filter((direction) => tile.getNeighbour(direction).improvements.includes('railroad'));

                    if (adjoining.length) {
                      adjoining.forEach((direction) => images.push(renderer._getPreloadedImage(`assets/improvements/${improvement}_${direction}.gif`)));
                    }
                    else {
                      images.push(renderer._getPreloadedImage(`assets/improvements/${improvement}.gif`));
                    }
                  }
                  else {
                    images.push(renderer._getPreloadedImage(`assets/improvements/${improvement}.gif`));
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
        }

        if (layer === 'units' || layer === 'all') {
          if (! ('units' in tiles)) {
            tiles.units = [];
          }

          if (tile.units.length) {
            if (! engine.currentPlayer || ! engine.currentPlayer.activeUnit || ! tile.units.includes(engine.currentPlayer.activeUnit)) {
              let [unit] = tile.units.sort((a, b) => a.defence > b.defence ? -1 : a.defence === a.defence ? 0 : 1),
                image = renderer._createPreloadCanvas(),
                imageContext = image.getContext('2d'),
                unitImage = renderer._getPreloadedImage(`assets/units/${unit.name}.gif`), // TODO: have each unit details as a component
                {sourceColors} = Engine.Plugin.filter({type: 'asset', label: 'units'})[0],
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
                x: (unit.tile.terrain.size * unit.tile.x) + unit.offsetX,
                y: (unit.tile.terrain.size * unit.tile.y) + unit.offsetY
              });
            }
          }
        }

        if (layer === 'cities' || layer === 'all') {
          if (! ('cities' in tiles)) {
            tiles.cities = [];
          }

          if (tile.city) {
            let {city} = tile,
              image = renderer._createPreloadCanvas(),
              imageContext = image.getContext('2d'),
              cityImage = renderer._getPreloadedImage('assets/map/city.gif'),
              replaceColors = city.player.colors;

            image.width = city.tile.terrain.size;
            image.height = city.tile.terrain.size;
            imageContext.beginPath();
            imageContext.rect(0, 0, city.tile.terrain.size, city.tile.terrain.size);
            imageContext.fillStyle = replaceColors[0];
            imageContext.fill();
            imageContext.drawImage(cityImage, 0, 0);

            image = renderer.replaceColor(image, ['#000'], [replaceColors[1]]);

            tiles.cities.push({
              images: [image],
              background: city.player.colour,
              text: city.size,
              textBelow: city.name,
              height: city.tile.terrain.size,
              width: city.tile.terrain.size,
              x: city.tile.terrain.size * city.tile.x,
              y: city.tile.terrain.size * city.tile.y
            });
          }
        }

        if (layer === 'activeUnits' || layer === 'all') {
          if (! ('activeUnits' in tiles)) {
            tiles.activeUnits = [];
          }

          if (engine.currentPlayer && engine.currentPlayer.activeUnit && tile.units.includes(engine.currentPlayer.activeUnit)) {
            const unit = engine.currentPlayer.activeUnit,
              {tile} = unit,
              image = renderer._createPreloadCanvas(),
              imageContext = image.getContext('2d'),
              unitImage = renderer._getPreloadedImage(`assets/units/${unit.name}.gif`);

            image.width = unitImage.width;
            image.height = unitImage.height;

            if (tile.units.length > 1) {
              image.width = unitImage.width + 1;
              image.height = unitImage.height + 1;
              imageContext.drawImage(unitImage, 1, 1);
            }

            imageContext.drawImage(unitImage, 0, 0);
            imageContext.save();

            const {sourceColors} = Engine.Plugin.first({package: 'base-renderer', type: 'asset', label: 'units'}),
              replaceColors = engine.currentPlayer.colors;

            tiles.activeUnits.push({
              images: [renderer.replaceColor(image, sourceColors, replaceColors)],
              height: unit.height,
              width: unit.width,
              x: unit.tile.terrain.size * unit.tile.x,
              y: unit.tile.terrain.size * unit.tile.y
            });
          }
        }

        if (layer === 'visibility' || layer === 'all') {
          if (! ('visibility' in tiles)) {
            tiles.visibility = [];
          }

          let player;

          if (engine.currentPlayer) {
            player = engine.currentPlayer;

            if (! tile.isVisible(player.id)) {
              tiles.visibility.push({
                background: '#000',
                height: tile.terrain.size,
                width: tile.terrain.size,
                x: tile.terrain.size * tile.x,
                y: tile.terrain.size * tile.y
              });
            }
            else {
              const images = [];

              ['n', 'e', 's', 'w'].forEach((direction) => {
                if (! tile.getAdjacent()[direction].isVisible(player.id)) {
                  images.push(renderer._getPreloadedImage(`assets/map/fog_${direction}.gif`));
                }
              });

              if (images.length) {
                tiles.visibility.push({
                  images: images,
                  height: tile.terrain.size,
                  width: tile.terrain.size,
                  x: tile.terrain.size * tile.x,
                  y: tile.terrain.size * tile.y
                });
              }
            }
          }
        }

        if (layer === 'activeVisibility' || layer === 'all') {
          if (! ('activeVisibility' in tiles)) {
            tiles.activeVisibility = [];
          }

          let player;

          if (engine.currentPlayer) {
            player = engine.currentPlayer;

            if (! tile.isActivelyVisible(player.id)) {
              tiles.activeVisibility.push({
                background: '#000',
                height: tile.terrain.size,
                width: tile.terrain.size,
                x: tile.terrain.size * tile.x,
                y: tile.terrain.size * tile.y
              });
            }
            else {
              const images = [];

              ['n', 'e', 's', 'w'].forEach((direction) => {
                if (! tile.getAdjacent()[direction].isActivelyVisible(player.id)) {
                  images.push(renderer._getPreloadedImage(`assets/map/fog_${direction}.gif`));
                }
              });

              if (images.length) {
                tiles.activeVisibility.push({
                  images: images,
                  height: tile.terrain.size,
                  width: tile.terrain.size,
                  x: tile.terrain.size * tile.x,
                  y: tile.terrain.size * tile.y
                });
              }
            }
          }
        }

        if (global.debug) {
          if (! tiles.grid) {
            tiles.grid = [];

            const image = renderer._createPreloadCanvas(),
              imageContext = image.getContext('2d');

            image.width = tile.terrain.size;
            image.height = tile.terrain.size;

            imageContext.fillStyle = '#000';
            imageContext.fillRect(0, 0, image.width, 1);
            imageContext.fillRect(image.width, 0, image.width, image.height);
            imageContext.fillRect(0, image.height, image.width, image.height);
            imageContext.fillRect(0, 0, 1, image.height);

            tiles.grid.push({
              images: [image],
              height: tile.terrain.size,
              width: tile.terrain.size,
              x: tile.terrain.size * tile.x,
              y: tile.terrain.size * tile.y
            });
          }
        }
      });
    });

    renderer.layerOrder.forEach((layerName) => {
      if ((layer === layerName) || (layer === 'all')) {
        const layerObject = new BaseRenderer.Layer({
          name: layerName,
          tiles: tiles[layerName]
        });

        renderer.layers[layerName] = layerObject.render();
      }
    });

    if (global.debug) {
      const dummyWhite = new BaseRenderer.Layer({
        name: 'dummyWhite',
        tiles: []
      });

      dummyWhite.context.fillStyle = '#fff';
      dummyWhite.context.fillRect(0, 0, dummyWhite.width, dummyWhite.height);
      renderer.layers.dummyWhite = dummyWhite.render();

      const dummyBlack = new BaseRenderer.Layer({
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
    const renderer = this,
      canvas = document.createElement('canvas');

    renderer.preload.appendChild(canvas);

    return canvas;
  }

  _cleanupPreloadCanvas() {
    const renderer = this;

    Array.from(renderer.preload.querySelectorAll('canvas')).forEach((node) => {
      renderer.preload.removeChild(node);
    });

    return true;
  }

  _getPreloadedImage(path) {
    const renderer = this;

    if (! path.match(/^\//)) {
      path = Engine.Plugin.getPath('base-renderer') + path;
    }

    return renderer.preload.querySelector(`[data-path="${path}"]`);
  }

  replaceColor(canvas, source, replacement) {
    const context = canvas.getContext('2d');

    context.save();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const _getColor = (input) => {
      let match = [],
        color = {};

      if (typeof (input) === 'string') {
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

    const sourceColors = source.map(_getColor),
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
    const renderer = this;

    renderer.portal = document.createElement('canvas');
    renderer.portal.width = window.innerWidth;
    renderer.portal.height = window.innerHeight;
    renderer.portalContext = renderer.portal.getContext('2d');

    engine.scale = engine.scale || 1;

    if (! renderer.center) {
      renderer.center = engine.currentPlayer && engine.currentPlayer.activeUnit ?
        engine.currentPlayer.activeUnit.tile :
        engine.map.get(0, 0);
    }

    renderer.portal.centerX = parseInt(renderer.portal.width / 2);
    renderer.portal.centerY = parseInt(renderer.portal.height / 2);

    let tileSize = renderer.center.terrain.size * engine.scale,
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
      for (let x = startX; x < endX; x += layerWidth * engine.scale) {
        for (let y = startY; y < endY; y += layerHeight * engine.scale) {
          if (renderer.layers[layer]) {
            renderer.portalContext.drawImage(renderer.layers[layer], x, y, layerWidth * engine.scale, layerHeight * engine.scale);
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
const layerDefaults = {
  activeVisibility: {
    globalAlpha: 0.33
  }
};

// global.BaseRenderer.Layer = class BaseLayer extends Layer {
BaseRenderer.Layer = class BaseLayer {
  constructor(details) {
    const layer = this;

    extend(layer, details);

    if (layer.name in layerDefaults) {
      extend(layer, layerDefaults[layer.name]);
    }

    layer.tileSize = engine.map.terrainTypes[0].size;

    layer.canvas = document.createElement('canvas');
    layer.width = layer.canvas.width = engine.map.width * layer.tileSize;
    layer.height = layer.canvas.height = engine.map.height * layer.tileSize;
    layer.context = layer.canvas.getContext('2d');

    layer.tiles.forEach((tile) => {
      tile.images = (tile.images || []);
    });
  }

  render() {
    const layer = this;

    if (layer.globalAlpha) {
      layer.context.globalAlpha = layer.globalAlpha;
    }

    layer.tiles.forEach((tile) => {
      if (tile.background) {
        layer.context.fillStyle = tile.background;
        layer.context.fillRect(tile.x, tile.y, tile.width, tile.height);
      }

      tile.images.forEach((image) => {
        if (! image) {
          // console.log(`image:${image}, name:${layer.name}, x:${tile.x}, y:${tile.y}`);
        }
        else {
          layer.context.drawImage(image, tile.x + (Math.floor((tile.width - image.width) / 2)), tile.y + (Math.floor((tile.height - image.height) / 2)), image.width, image.height);
        }
      });

      if (tile.text) {
        layer.context.font = 'bold 10px sans-serif';
        layer.context.fillStyle = 'black';
        layer.context.textAlign = 'center';
        layer.context.fillText(tile.text, tile.x + 9, tile.y + 12);
        layer.context.font = 'bold 10px sans-serif';
        layer.context.fillStyle = 'white';
        layer.context.textAlign = 'center';
        layer.context.fillText(tile.text, tile.x + 8, tile.y + 11);
      }

      if (tile.textBelow) {
        layer.context.font = 'bold 10px sans-serif';
        layer.context.fillStyle = 'black';
        layer.context.textAlign = 'center';
        layer.context.fillText(tile.textBelow, tile.x + 8, tile.y + 28);
        layer.context.font = 'bold 10px sans-serif';
        layer.context.fillStyle = '#08E3EF';
        layer.context.textAlign = 'center';
        layer.context.fillText(tile.textBelow, tile.x + 7, tile.y + 27);
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
//             let image = new global.Image();
//             image.src = 'file://' + Engine.Plugin.getPath('base-renderer') + file;

//             BaseRenderer.Extract.images.push({
//                 element: image,
//                 file: file
//             });
//         });
//     },
//     run: () => {
//         let canvas = document.createElement('canvas'),
//         context = canvas.getContext('2d');

//         BaseRenderer.Extract.images.forEach((image) => {
//             Object.keys(BaseRenderer.Extract.data.files[image.file]).forEach((path) => {
//                 let definitions = BaseRenderer.Extract.data.files[image.file][path];

//                 definitions.forEach((definition) => {
//                     definition.contents.forEach((content) => {
//                         let object = extend({}, BaseRenderer.Extract.data.defaults, definition, content),
//                         filename = Engine.Plugin.getPath('base-renderer') + 'assets/' + path + object.name + '.gif',
//                         dirname = filename.replace(/\/[^\/]+$/, '/');

//                         canvas.width = object.width;
//                         canvas.height = object.height;
//                         context.clearRect(0, 0, canvas.width, canvas.height);
//                         context.drawImage(image.element, -object.x, -object.y);

//                         for (let x = 0; x < canvas.width; x++) {
//                             for (let y = 0; y < canvas.height; y++) {
//                                 let imageData = context.getImageData(x, y, 1, 1).data;

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

//                         let buffer = new Buffer(canvas.toDataURL('image/gif').split(/,/)[1], 'base64');

//                         fs.writeFileSync(filename, buffer);
//                     });
//                 });
//             });
//         });
//     }
// };

global.renderer = new BaseRenderer();

engine.on('game:start', () => global.renderer.init());

engine.on('player-turn-start', (player) => {
  ['visibility', 'activeVisibility'].forEach((layer) => engine.emit('build-layer', layer));
});
