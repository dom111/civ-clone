import GreatLibrary from '../../GreatLibrary.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(GreatLibrary, 300);

export default getRules;
