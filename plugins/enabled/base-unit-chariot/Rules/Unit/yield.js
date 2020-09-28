import Chariot from '../../Chariot.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Chariot, 4, 1, 2);

export default getRules;
