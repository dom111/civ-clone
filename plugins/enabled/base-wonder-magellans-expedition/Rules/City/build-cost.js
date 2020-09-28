import MagellansExpedition from '../../MagellansExpedition.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(MagellansExpedition, 400);

export default getRules;
