import Musketman from '../../Musketman.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Musketman, 30);

export default getRules;
