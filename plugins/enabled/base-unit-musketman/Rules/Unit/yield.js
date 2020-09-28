import Musketman from '../../Musketman.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Musketman, 2, 3);

export default getRules;
