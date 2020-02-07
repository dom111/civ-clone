import {Science as ScienceYield} from '../../base-science/Yields/Science.js';
import TradeRate from '../TradeRate.js';

export class Science extends TradeRate {
  static tradeYield = ScienceYield;
}

export default Science;
