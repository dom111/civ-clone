import RulesRegistry from '../core-rules/RulesRegistry.js';

export class Unit {
  #city;
  #player;
  #tile;

  movesLeft = 0;
  waiting = false;

  // TODO: This should be a valueObject collection with ValueObjects for each bonus
  improvements = [];

  destroyed = false;
  active = true;
  busy = false;
  status = null;

  constructor({player, city, tile}) {
    if (! tile) {
      throw new TypeError(`Unit#constructor: tile is '${tile}'.`);
    }

    this.#player = player;
    this.#city   = city;
    this.#tile   = tile;

    engine.emit('unit:created', this);
  }

  activate() {
    this.active = true;
    this.busy = false;
    this.status = null;
  }

  applyVisibility() {
    this.#tile.getSurroundingArea(this.visibility)
      .forEach((tile) => engine.emit('tile:seen', tile, this.#player))
    ;
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
    const {attack} = this;

    RulesRegistry.get('unit:combat:attack')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => attack.addModifier(rule.process(this)))
    ;

    return attack.value();
  }

  finalDefence() {
    const {defence} = this;

    RulesRegistry.get('unit:combat:defence')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => defence.addModifier(rule.process(this)))
    ;

    return defence.value();
  }

  action(action) {
    action.perform();
  }

  // pillage() {
  //   // TODO: investigate using promises here instead...
  //   this.delayedAction({
  //     status: 'pillaging',
  //     action: () => {
  //       engine.emit('tile:improvement-pillaged', this.tile, [...this.tile.improvements].pop());
  //       engine.emit('unit:activate', this);
  //     },
  //     turns: 1,
  //   });
  // }

  get player() {
    return this.#player;
  }

  // sleep() {
  //   engine.emit('unit:action', this, 'sleep');
  //   this.active = false;
  //   this.busy = Infinity;
  //   this.action = 'sleep';
  // }

  get tile() {
    return this.#tile;
  }

  set tile(tile) {
    this.#tile = tile;
  }

  wait() {
    this.waiting = true;
  }
}

export default Unit;
