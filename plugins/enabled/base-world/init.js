import World from '../core-world/World.js';
import WorldGeneratorRegistry from '../core-world-generator/Registry.js';

engine.on('engine:build', () => {
  const availableGenerators = WorldGeneratorRegistry.entries(),
    Generator = availableGenerators[Math.floor(availableGenerators.length * Math.random())],
    generatorOptions = {
      landCoverage: .3 + (Math.random() * .4),
      landMassReductionScale: Math.random() * 5,
      // chanceToBecomeLand: Math.random() / 15,
      // smoothness
      maxIterations: 5,
    },
    generator = new Generator({
      ...generatorOptions,
      height: parseInt(engine.option('height', 100), 10),
      width: parseInt(engine.option('width', 160), 10),
    }),
    world = new World(generator)
  ;

  world.build();

  engine.emit('world:built', world);
});

engine.on('tile:seen', (tile, player) => {
  if (! player.seenTiles.includes(tile)) {
    player.seenTiles.push(tile);

    engine.emit('player:visibility-changed', player);
  }
});
