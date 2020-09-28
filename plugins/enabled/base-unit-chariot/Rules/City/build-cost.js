import Chariot from '../../Chariot.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Chariot, 40);

export default getRules;
