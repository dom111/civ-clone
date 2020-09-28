import Colossus from '../../Colossus.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Colossus, 200);

export default getRules;
