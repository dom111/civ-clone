import Warrior from '../../Warrior.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Warrior, 10);

export default getRules;
