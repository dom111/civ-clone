import Colosseum from '../../Colosseum.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Colosseum, 100);

export default getRules;
