import AvailableTerrainFeatureRegistry from '../../../core-terrain-features/AvailableTerrainFeatureRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:created:applyFeatures',
  new Criterion((terrain) => AvailableTerrainFeatureRegistry.entries()
    .forEach((TerrainFeature) => RulesRegistry.get('terrain:feature')
      .filter((rule) => rule.validate(TerrainFeature, terrain))
      .forEach((rule) => rule.process(TerrainFeature, terrain))
    )
  )
));
