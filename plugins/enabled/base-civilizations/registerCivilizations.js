import {
  American,
  Aztec,
  Babylonian,
  English,
  French,
  German,
  Greek,
  Indian,
  Japanese,
  Polish,
  Roman,
  Russian,
  Spanish,
} from './Civilizations.js';
import CivilizationRegistry from '../core-civilization/CivilizationRegistry.js';

[
  American,
  Aztec,
  Babylonian,
  English,
  French,
  German,
  Greek,
  Indian,
  Japanese,
  Polish,
  Roman,
  Russian,
  Spanish,
]
  .forEach((Civilization) => CivilizationRegistry.getInstance()
    .register(Civilization)
  )
;
