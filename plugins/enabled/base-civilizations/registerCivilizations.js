import * as Civilizations from './Civilizations.js';
import CivilizationRegistry from '../core-civilization/CivilizationRegistry.js';

CivilizationRegistry.getInstance()
  .register(...Object.values(Civilizations))
;
