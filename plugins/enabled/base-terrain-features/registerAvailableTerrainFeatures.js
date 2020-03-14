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
import AvailableTerrainFeatureRegistry from '../core-terrain-features/AvailableTerrainFeatureRegistry.js';

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
  .forEach((TerrainFeature) => AvailableTerrainFeatureRegistry.getInstance()
    .register(TerrainFeature)
  )
;