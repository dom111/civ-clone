export class Unit {
  static #units = {};

  #player;
  #tile;

  attack = 0;
  defence = 0;
  movement = 1;
  visibility = 1;

  offsetX = 0;
  offsetY = 0;

  // TODO: This should be a valueObject collection with ValueObjects for each bonus
  bonuses = [];

  destroyed = false;
  active = false;
  busy = false;
  status = null;

  // TODO: could this be replaced by a Promise?
  delayedAction({
    action,
    completeTurn,
    status
  }) {
    this.status = status;

    const turnStartHandler = (player) => {
      if (player === this.player && engine.turn === completeTurn) {
        this.currentAction = this.busy = false;

        action();

        engine.off('turn:start', turnStartHandler);
      }
    };

    engine.on('unit:activate', (unit) => {
      if (unit === this) {
        engine.off('turn:start', turnStartHandler);
      }
    });

    engine.on('turn:start', turnStartHandler);
  }

  pillage() {
    // TODO: investigate using promises here instead...
    this.delayedAction({
      status: 'pillaging',
      action: () => {
        engine.emit('tile:improvement-pillaged', this.tile, [...this.tile.improvements].pop());
        engine.emit('unit:activate', this);
      },
      completeTurn: engine.turn + 1
    });
  }

  sleep() {
    this.busy = true;
    this.action = 'sentry';
  }

  fortify() {
    this.busy = true;
    this.action = 'fortify';

    this.delayedAction({
      status: 'fortify',
      action: () => {
        // TODO
        // this.bonuses.add(new Fortified());
      },
      completeTurn: engine.turn + 1
    });
  }

  disband() {
    this.destroy();
    engine.emit('unit:disbanded', this);
  }

  noOrders() {
    this.delayedAction({
      status: 'noOrders',
      action: () => {
        this.busy = false;
      },
      completeTurn: engine.turn + 1
    });
  }

  static units = [];
  static available = {};


  static fromDefinition({
    unit,
    player,
    tile
  }) {
    if (! (unit in this.#units)) {
      throw new TypeError(`Unknown Unit: '${unit}'.`);
    }

    return new (this.#units[unit])({
      player,
      tile
    });
  }

  static register(constructor) {
    this.#units[constructor.name] = constructor;
  }

  constructor({
    player,
    tile
  }) {
    this.#player = player;
    this.#tile   = tile;

    player.units.push(this);

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
    return this.tile.isNeighbourOf(to);
  }

  // TODO: break this down, so moves can be validated and allow for extension (capturing settlers, barbarian 'leaders' etc)
  validateMove(to) {
    if (! to) {
      return false;
    }

    const unit = this,
      {neighbours} = unit.tile
    ;

    if (! this.canMoveTo(to)) {
      return false;
    }

    if (unit.movesLeft <= 0.1) {
      return false;
    }

    if (! Object.keys(neighbours).map((position) => neighbours[position]).includes(to)) {
      return false;
    }

    if (to.units.length && to.units[0].player !== unit.player) {
      return unit.resolveCombat(to.units);
    }

    if (to.city && to.city.player !== unit.player) {
      // TODO: interact
      return false;
    }

    // TODO: adjacency rules

    // TODO
    const movementCost = unit.tile.movementCost(to);

    if (movementCost > unit.movesLeft) {
      if ((Math.random() * 1.5) < (unit.movesLeft / movementCost)) {
        unit.movesLeft = 0;

        return false;
      }
    }

    return movementCost;
  }

  move(to) {
    const unit = this,
      from = unit.tile;

    if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].includes(to)) {
      to = unit.tile.neighbours[to];
    }

    const movementCost = unit.validateMove(to);

    if (movementCost !== false) {
      unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);

      unit.tile = to;
      unit.tile.units.push(unit);

      unit.movesLeft -= movementCost;

      if (unit.movesLeft <= 0.1) {
        unit.movesLeft = 0;
      }

      engine.emit('unit:moved', unit, from, to);
    }
    else {
      // TODO: use notifications
      console.log(`Can't move ${unit.player.people} ${unit.title} from ${unit.tile.x},${unit.tile.y} to ${to.x},${to.y}`);
    }
  }

  // TODO: make it so that a combat free version of the game can
  resolveCombat(units) {
    const unit = this;

    const [defender] = units.sort((a,b) => a.defence > b.defence ? -1 : a.defence === b.defence ? 0 : 1),

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

  action(action) {
    if (this.can(action)) {
      this.actions[action].run(this, this.actions[action]);

      engine.emit('unit:action', this, this.actions[action]);
    }
    else {
      // TODO: use notifications or squelch
      console.log(`Can't call action ${action} on ${this.player.people} ${this.title}`);
    }
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
