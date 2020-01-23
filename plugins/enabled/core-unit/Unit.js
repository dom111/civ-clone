import Rules from '../core-rules/Rules.js';

export class Unit {
  #city;
  #data = {};
  #player;
  #tile;

  attack = 0;
  defence = 0;
  movement = 1;
  movesLeft = 0;
  visibility = 1;
  waiting = false;

  offsetX = 0;
  offsetY = 0;

  // TODO: This should be a valueObject collection with ValueObjects for each bonus
  improvements = [];

  destroyed = false;
  active = true;
  busy = false;
  status = null;

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
    this.#tile.getSurroundingArea(this.visibility)
      .forEach((tile) => engine.emit('tile:seen', tile, this.#player))
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

  destroy(player = null) {
    engine.emit('unit:destroyed', this, player);
  }

  disband() {
    engine.emit('unit:action', this, 'disband');
    this.destroy();
    engine.emit('unit:disbanded', this);
  }

  finalAttack() {
    let attack = this.attack * Math.random();

    Rules.get('unit:combat:attack')
      .forEach((rule) => {
        if (rule.validate(this)) {
          attack += (rule.process(this) || 0);
        }
      })
    ;

    return attack;
  }

  finalDefence() {
    let defence = this.defence * Math.random();

    Rules.get('unit:combat:defence')
      .forEach((rule) => {
        if (rule.validate(this)) {
          defence += (rule.process(this) || 0);
        }
      })
    ;

    return defence;
  }

  move(to) {
    const from = this.tile;

    to = from.get(to);

    if (! this.validateMove(to)) {
      return false;
    }

    if (to.units.length && to.units[0].player !== this.player) {
      this.resolveCombat(to.units);
    }
    else if (to.city && to.city.player !== this.player) {
      if (to.units.length > 0) {
        this.resolveCombat(to.units);
      }
      else {
        engine.emit('city:captured', to.city, this.player);
      }
    }

    const [movementCost] = Rules.get('unit:movementCost')
      .filter((rule) => rule.validate(this, to))
      .map((rule) => rule.process(this, to))
      .sort((a, b) => a - b)
    ;

    if (movementCost > this.movesLeft && (Math.random() * 1.5) < (this.movesLeft / movementCost)) {
      this.movesLeft = 0;

      return false;
    }

    if (movementCost !== false) {
      this.#tile = to;

      this.movesLeft -= movementCost;

      if (this.movesLeft <= .1) {
        this.movesLeft = 0;
      }

      engine.emit('unit:moved', this, from, to);

      return;
    }

    // TODO: use notifications
    engine.emit('unit:move-failed', this, this.tile, to);
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

  get player() {
    return this.#player;
  }

  // TODO: make it so that a combat free version of the game can
  resolveCombat(units) {
    const [defender] = units.sort((a,b) => b.finalDefence() - a.finalDefence());

    if (this.finalAttack() >= defender.finalDefence()) {
      // TODO: fire a defeated event and process based on rules
      if (this.tile.city || this.tile.improvements.includes('fortress')) {
        defender.destroy(this.player);
      }
      else {
        defender.tile.units.forEach((unit) => unit.destroy(this.player));
      }

      return true;
    }

    this.destroy(defender.player);

    return false;
  }

  sleep() {
    engine.emit('unit:action', this, 'sleep');
    this.busy = true;
    this.action = 'sleep';
  }

  get tile() {
    return this.#tile;
  }

  set tile(tile) {
    this.#tile = tile;
  }

  // TODO: break this down, so moves can be validated and allow for extension (capturing settlers, barbarian 'leaders' etc)
  validateMove(to, from) {
    return Rules.get('unit:movement')
      .every((rule) => rule.validate(this, this.tile.get(to), from))
    ;
  }

  wait() {
    this.waiting = true;
  }
}

export default Unit;
