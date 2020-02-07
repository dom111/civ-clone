export class PlayerTradeRates {
  #fudgeFactor = 100;
  #player;
  #rates = [];

  constructor(player, ...rates) {
    this.#player = player;
    this.#rates = rates;
  }

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

    others.forEach((rate) => rate.set((rate.value / current) * available));

    if (this.total() < 1) {
      others[Math.floor(others.length * Math.random())].add(1 - this.total());
    }

    if (this.total() > 1) {
      others[Math.floor(others.length * Math.random())].subtract(1 - this.total());
    }
  }

  get(Type) {
    const [rate] = this.#rates
      .filter((rate) => rate instanceof Type)
    ;

    return rate;
  }

  get player() {
    return this.#player;
  }

  set(Type, value) {
    const rate = this.get(Type);

    rate.set(value);

    this.balance(rate);
  }

  total() {
    return Math.round(
      this.#rates
        .reduce((total, rate) => total + rate.value(), 0) * this.#fudgeFactor
    ) / this.#fudgeFactor
    ;
  }
}