import Swordman from '../../Swordman.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Swordman, 3);

export default getRules;
