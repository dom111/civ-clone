import Settlers from '../../Settlers.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Settlers, 0);

export default getRules;
