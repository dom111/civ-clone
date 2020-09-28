import GreatWall from '../../GreatWall.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(GreatWall, 300);

export default getRules;
