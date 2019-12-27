import Babylonian from './Babylonian.js';
import Civilization from 'core-civilization/Civilization.js';
import English from './English.js';
import German from './German.js';

// TODO
Object.defineProperty(engine,  'civilizations', {
  value: []
});

Civilization.register(new Babylonian());
Civilization.register(new English());
Civilization.register(new German());
