export class Unit {
  static #units = {};

  #city;
  #data = {};
  #player;
  #tile;

  attack = 0;
  defence = 0;
  movement = 1;
  movesLeft = 0;
  visibility = 1;

  offsetX = 0;
  offsetY = 0;

  // TODO: This should be a valueObject collection with ValueObjects for each bonus
  bonuses = [];

  destroyed = false;
  active = true;
  busy = false;
  status = null;

  static units = [];
  static available = {};

  static fromName(unit, ...args) {
    if (! (unit in this.#units)) {
      throw new TypeError(`Unknown Unit: '${unit}'.`);
    }

    return new (this.#units[unit])(...args);
  }

  static register(constructor) {
    this.#units[constructor.name] = constructor;

    engine.emit('unit:registered', constructor);
  }

  constructor({player, city, tile}) {
    if (! tile) {
      throw new Error('tile is undefined');
    }

    this.#player = player;
    this.#city   = city;
    this.#tile   = tile;
    // TODO: private with getter
    this.movesLeft = this.movement;

    player.units.push(this);

    if (city) {
      city.units.push(this);
    }

    this.applyVisibility();

    engine.emit('unit:created', this);
  }

  applyVisibility() {
    const unit = this;

    for (let x = this.#tile.x - unit.visibility; x <= unit.tile.x + unit.visibility; x++) {
      for (let y = this.#tile.y - unit.visibility; y <= unit.tile.y + unit.visibility; y++) {
        engine.emit('tile:seen', this.#tile.map.get(x, y), this.#player);
      }
    }

    engine.emit('player:visibility-changed', this.#player);
  }

  canMoveTo(to) {
    // TODO: use World#directions for compatibility of hex based `World`s
    if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].includes(to)) {
      to = this.tile.neighbours[to];
    }

    // TODO: check if land/water and validate unit can move there
    return this.tile.isNeighbourOf(to) &&
      to.isLand
    ;
  }

  data(key, value = null) {
    if (value === null) {
      return this.#data[key];
    }

    this.#data[key] = value;
  }

  // TODO: could this be replaced by a UnitAction entity?
  delayedAction({
    action,
    turns,
    status,
  }) {
    engine.emit('unit:action', this, action);
    this.busy = turns;
    this.status = status;
    this.active = false;
    this.actionOnComplete = action;
  }

  disband() {
    engine.emit('unit:action', this, 'disband');
    this.destroy();
    engine.emit('unit:disbanded', this);
  }

  fortify() {
    this.delayedAction({
      status: 'fortify',
      action: () => {
        // TODO
        // this.bonuses.add(new Fortified());
      },
      turns: 1,
    });
  }

  noOrders() {
    this.delayedAction({
      status: 'noOrders',
      action: () => {
        this.busy = false;
      },
      turns: 1,
    });
  }

  pillage() {
    // TODO: investigate using promises here instead...
    this.delayedAction({
      status: 'pillaging',
      action: () => {
        engine.emit('tile:improvement-pillaged', this.tile, [...this.tile.improvements].pop());
        engine.emit('unit:activate', this);
      },
      turns: 1,
    });
  }

  sleep() {
    engine.emit('unit:action', this, 'sleep');
    this.busy = true;
    this.action = 'sleep';
  }

  // TODO: break this down, so moves can be validated and allow for extension (capturing settlers, barbarian 'leaders' etc)
  validateMove(to) {
    if (! to) {
      return false;
    }

    const {neighbours} = this.tile;

    if (! this.canMoveTo(to)) {
      return false;
    }

    if (this.movesLeft <= 0.1) {
      return false;
    }

    if (! Object.keys(neighbours).map((position) => neighbours[position]).includes(to)) {
      return false;
    }

    if (to.units.length && to.units[0].player !== this.player) {
      this.resolveCombat(to.units);

      return true;
    }

    if (to.city && to.city.player !== this.player) {
      if (to.units.length > 0) {
        this.resolveCombat(to.units);

        return true;
      }

      return engine.emit('city:captured', to.city, this.player);
    }

    // TODO: adjacency rules

    const movementCost = this.tile.movementCost(to);

    if (movementCost > this.movesLeft) {
      if ((Math.random() * 1.5) < (this.movesLeft / movementCost)) {
        this.movesLeft = 0;

        return false;
      }
    }

    return movementCost;
  }

  move(to) {
    const from = this.tile;

    if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].includes(to)) {
      to = this.tile.neighbours[to];
    }

    const movementCost = this.validateMove(to);

    if (movementCost !== false) {
      this.tile.units = this.tile.units.filter((tileUnit) => tileUnit !== this);

      this.#tile = to;
      to.units.push(this);

      this.movesLeft -= movementCost;

      if (this.movesLeft <= .1) {
        this.movesLeft = 0;
      }

      engine.emit('unit:moved', this, from, to);
    }
    else {
      // TODO: use notifications
      engine.emit('unit:move-failed', `Can't move ${this.player.civilization.people} ${this.title} from ${this.tile.x},${this.tile.y} to ${to.x},${to.y}`);
    }
  }

  // TODO: make it so that a combat free version of the game can
  resolveCombat(units) {
    const unit = this;

    const [defender] = units.sort((a,b) => b.defence - a.defence),

      // TODO: get current combat scheme and use that to resolve
      result = Unit.combat.resolve(this, defender)
    ;

    if (result) {
      if (unit.tile.city || unit.tile.improvements.includes('fortress')) {
        defender.destroy();
      }
      else {
        defender.tile.units.forEach((unit) => unit.destroy());
      }
    }
    else {
      this.destroy();
    }

    return result;
  }

  can(action) {
    return action in this.actions;
  }

  destroy() {
    engine.emit('unit:destroyed', this);
  }

  get tile() {
    return this.#tile;
  }

  get player() {
    return this.#player;
  }
}

export default Unit;
