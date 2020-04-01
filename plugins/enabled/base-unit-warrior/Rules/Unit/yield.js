import Warrior from '../../Warrior.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Warrior);

export default getRules;
