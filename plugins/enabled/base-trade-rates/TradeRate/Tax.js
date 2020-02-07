import {Gold} from '../../base-currency/Yields.js';
import TradeRate from '../TradeRate.js';

export class Tax extends TradeRate {
  static tradeYield = Gold;
}

export default Tax;
