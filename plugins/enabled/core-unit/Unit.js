import {Attack, Defence, Movement, Visibility} from './Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class Unit {
  #city;
  #player;
  #tile;

  active = true;
  busy = false;
  destroyed = false;
  status = null;
  waiting = false;

  constructor({player, city, tile}) {
    this.#city   = city;
    this.#player = player;
    this.#tile   = tile;

    RulesRegistry.get('unit:created')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this))
    ;
  }

  action(action) {
    action.perform();
  }

  actions(to = this.tile) {
    return RulesRegistry.get('unit:action')
      .filter((rule) => rule.validate(this, to, this.tile))
      .map((rule) => rule.process(this, to, this.tile))
    ;
  }

  activate() {
    return RulesRegistry.get('unit:activate')
      .filter((rule) => rule.validate(this))
      .map((rule) => rule.process(this))
    ;
  }

  applyVisibility() {
    this.#tile.getSurroundingArea(this.visibility)
      .forEach((tile) => engine.emit('tile:seen', tile, this.#player))
    ;
  }

  get attack() {
    const [unitYield] = this.yield(new Attack());

    return unitYield;
  }

  get city() {
    return this.#city;
  }

  get defence() {
    const [unitYield] = this.yield(new Defence());

    return unitYield;
  }

  destroy(player = null) {
    RulesRegistry.get('unit:destroyed')
      .filter((rule) => rule.validate(this, player))
      .forEach((rule) => rule.process(this, player))
    ;
  }

  get movement() {
    const [unitYield] = this.yield(new Movement());

    return unitYield;
  }

  get player() {
    return this.#player;
  }

  get tile() {
    return this.#tile;
  }

  set tile(tile) {
    this.#tile = tile;
  }

  get visibility() {
    const [unitYield] = this.yield(new Visibility());

    return unitYield;
  }

  wait() {
    this.waiting = true;
  }

  yield(...yields) {
    yields.forEach((unitYield) => RulesRegistry.get('unit:yield')
      .filter((rule) => rule.validate(this, unitYield))
      .forEach((rule) => rule.process(this, unitYield))
    );

    return yields;
  }
}

export default Unit;
