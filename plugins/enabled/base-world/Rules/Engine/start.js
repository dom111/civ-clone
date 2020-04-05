import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';
import World from '../../../core-world/World.js';
import WorldGeneratorRegistry from '../../../core-world-generator/WorldGeneratorRegistry.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
  worldGeneratorRegistry = WorldGeneratorRegistry.getInstance(),
} = {}) => [
  new Rule(
    'engine:start:build-world',
    new Effect(() => {
      // TODO: Registry.getRandom()
      const availableGenerators = worldGeneratorRegistry.entries(),
        Generator = availableGenerators[Math.floor(availableGenerators.length * Math.random())],
        generatorOptions = {
          landCoverage: parseFloat(engine.option('landCoverage', .2 + (Math.random() * .2)), 10),
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

      rulesRegistry.process('world:built', world);
    })
  ),
];

export default getRules;
