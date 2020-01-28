import {
  American,
  Babylonian,
  English,
  French,
  German,
  Greek,
  Indian,
  Japanese,
  Roman,
  Russian,
  Spanish,
} from './Civilizations.js';
import CivilizationRegistry from '../core-civilization/CivilizationRegistry.js';

[
  American,
  Babylonian,
  English,
  French,
  German,
  Greek,
  Indian,
  Japanese,
  Roman,
  Russian,
  Spanish,
]
  .forEach((Civilization) => CivilizationRegistry.register(Civilization))
;
