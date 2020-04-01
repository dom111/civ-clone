import Marketplace from '../../Marketplace.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Marketplace, 80);

export default getRules;
