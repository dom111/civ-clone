import {Research as ResearchYield} from '../../base-science/Yields/Research.js';
import TradeRate from '../TradeRate.js';

export class Research extends TradeRate {
  static tradeYield = ResearchYield;
}

export default Research;
