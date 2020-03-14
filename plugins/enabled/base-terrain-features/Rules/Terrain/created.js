import AvailableTerrainFeatureRegistry from '../../../core-terrain-features/AvailableTerrainFeatureRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
  availableTerrainFeatureRegistry = AvailableTerrainFeatureRegistry.getInstance(),
} = {}) => [
  new Rule(
    'terrain:created:applyFeatures',
    new Criterion((terrain) => {
      const rules = rulesRegistry.get('terrain:feature');

      availableTerrainFeatureRegistry.entries()
        .forEach((TerrainFeature) => rules
          .filter((rule) => rule.validate(TerrainFeature, terrain))
          .forEach((rule) => rule.process(TerrainFeature, terrain))
        )
      ;
    })
  ),
];

export default getRules;
