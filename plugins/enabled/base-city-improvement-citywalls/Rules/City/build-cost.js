import CityWalls from '../../CityWalls.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(CityWalls, 120);

export default getRules;
