import World from '../../../core-world/World.js';
import WorldGeneratorRegistry from '../../../core-world-generator/WorldGeneratorRegistry.js';

engine.on('engine:start', () => {
  const availableGenerators = WorldGeneratorRegistry.getInstance()
      .entries()
    ,
    Generator = availableGenerators[Math.floor(availableGenerators.length * Math.random())],
    generatorOptions = {
      landCoverage: parseFloat(engine.option('landCoverage', .3 + (Math.random() * .4)), 10),
      landMassReductionScale: parseFloat(engine.option('landMassReductionScale', Math.random() * 5), 10),
      // chanceToBecomeLand: parseInt(engine.option('chanceToBecomeLand', Math.random() / 15), 10),
      // smoothness
      maxIterations: parseInt(engine.option('maxIterations', 5), 10),
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
