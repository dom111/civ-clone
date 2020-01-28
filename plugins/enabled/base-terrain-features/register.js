import {
  Coal,
  Fish,
  Game,
  Gems,
  Gold,
  Horse,
  Oasis,
  Oil,
  Seal,
  Shield,
} from './TerrainFeatures.js';
import TerrainFeatureRegistry from '../core-terrain-features/TerrainFeatureRegistry.js';

[
  Coal,
  Fish,
  Game,
  Gems,
  Gold,
  Horse,
  Oasis,
  Oil,
  Seal,
  Shield,
]
  .forEach((TerrainFeature) => TerrainFeatureRegistry.register(TerrainFeature))
;