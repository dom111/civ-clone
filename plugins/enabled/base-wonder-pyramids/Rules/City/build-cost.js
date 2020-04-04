import Pyramids from '../../Pyramids.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Pyramids, 300);

export default getRules;
