import {Luxuries as LuxuriesYield} from '../Yields/Luxuries.js';
import TradeRate from '../../base-trade-rates/TradeRate.js';

export class Luxuries extends TradeRate {
  static tradeYield = LuxuriesYield;
}

export default Luxuries;
