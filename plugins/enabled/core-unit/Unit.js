import {Attack, Defence, Movement, Moves, Visibility} from './Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class Unit {
  #city;
  #moves = new Moves();
  #player;
  #rulesRegistry;
  #tile;

  active = true;
  busy = false;
  destroyed = false;
  status = null;
  waiting = false;

  constructor({player, city, tile, rulesRegistry = RulesRegistry.getInstance()}) {
    this.#city   = city;
    this.#player = player;
    this.#tile   = tile;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('unit:created', this);
  }

  action(action, {...args} = {}) {
    action.perform({
      ...args,
      rulesRegistry: this.#rulesRegistry,
    });
  }

  actions(to = this.tile, from = this.tile) {
    return this.#rulesRegistry.process('unit:action', this, to, from);
  }

  activate() {
    return this.#rulesRegistry.process('unit:activate', this);
  }

  applyVisibility() {
    const rules = this.#rulesRegistry.get('tile:seen');

    this.#tile.getSurroundingArea(this.visibility)
      .forEach((tile) => rules
        .filter((rule) => rule.validate(tile, this.#player))
        .forEach((rule) => rule.process(tile, this.#player))
      )
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
    this.#rulesRegistry.process('unit:destroyed', this, player);
  }

  get movement() {
    const [unitYield] = this.yield(new Movement());

    return unitYield;
  }

  get moves() {
    return this.#moves;
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
    const rules = this.#rulesRegistry.get('unit:yield');

    yields.forEach((unitYield) => rules
      .filter((rule) => rule.validate(this, unitYield))
      .forEach((rule) => rule.process(this, unitYield))
    );

    return yields;
  }
}

export default Unit;
