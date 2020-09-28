import Catapult from '../../Catapult.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Catapult, 6);

export default getRules;
