export class PlayerTradeRates {
  /** @type {number} */
  #fudgeFactor = 100;
  /** @type {Player} */
  #player;
  /** @type {TradeRate[]} */
  #rates = [];

  /**
   * @param player {Player}
   * @param rates {...TradeRate}
   */
  constructor(player, ...rates) {
    this.#player = player;
    this.#rates = rates;
  }

  /**
   * @returns {TradeRate[]}
   */
  all() {
    return [...this.#rates];
  }

  /**
   * @param fixed {TradeRate}
   */
  balance(fixed) {
    if (this.total() === 1) {
      return;
    }

    const available = 1 - fixed.value(),
      others = this.#rates
        .filter((rate) => rate !== fixed)
      ,
      current = others
        .reduce((total, rate) => total + rate.value(), 0)
    ;

    others.forEach((rate) => rate.set((rate.value() / current) * available));

    if (this.total() < 1) {
      others[Math.floor(others.length * Math.random())].add(1 - this.total());
    }

    if (this.total() > 1) {
      others[Math.floor(others.length * Math.random())].subtract(1 - this.total());
    }
  }

  /**
   * @param Type {class}
   * @returns {number}
   */
  get(Type) {
    return this.#rates
      .filter((rate) => rate instanceof Type)
      .reduce((total, rate) => total + rate, 0)
    ;
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }

  /**
   * @param Type {class}
   * @param value {number}
   */
  set(Type, value) {
    const rate = this.get(Type);

    rate.set(value);

    this.balance(rate);
  }

  /**
   * @returns {number}
   */
  total() {
    return Math.round(
      this.#rates
        .reduce((total, rate) => total + rate.value(), 0) * this.#fudgeFactor
    ) / this.#fudgeFactor
    ;
  }
}

export default PlayerTradeRates;
