import {Attack, Defence, Movement, Moves, Visibility} from './Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class Unit {
  #active = true;
  #busy = null;
  #city;
  #destroyed = false;
  #moves = new Moves();
  #player;
  #rulesRegistry;
  #tile;
  #waiting = false;

  constructor({player, city, tile, rulesRegistry = RulesRegistry.getInstance()}) {
    this.#city   = city;
    this.#player = player;
    this.#tile   = tile;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('unit:created', this);
  }

  action({
    action,
    ...args
  } = {}) {
    return action.perform({
      ...args,
    });
  }

  actions(to = this.#tile, from = this.#tile) {
    return this.#rulesRegistry.process('unit:action', this, to, from);
  }

  activate() {
    return this.#rulesRegistry.process('unit:activate', this);
  }

  active() {
    return this.#active;
  }

  setActive(active = true) {
    this.#active = active;
  }

  applyVisibility() {
    const rules = this.#rulesRegistry.get('tile:seen');

    this.#tile.getSurroundingArea(this.visibility())
      .forEach((tile) => rules
        .filter((rule) => rule.validate(tile, this.#player))
        .forEach((rule) => rule.process(tile, this.#player))
      )
    ;
  }

  attack() {
    const [unitYield] = this.yield(new Attack());

    return unitYield;
  }

  busy() {
    return this.#busy;
  }

  setBusy(rule = null) {
    this.#busy = rule;
  }

  city() {
    return this.#city;
  }

  defence() {
    const [unitYield] = this.yield(new Defence());

    return unitYield;
  }

  destroy(player = null) {
    this.#rulesRegistry.process('unit:destroyed', this, player);
  }

  destroyed() {
    return this.#destroyed;
  }

  setDestroyed() {
    this.#destroyed = true;
  }

  movement() {
    const [unitYield] = this.yield(new Movement());

    return unitYield;
  }

  moves() {
    return this.#moves;
  }

  player() {
    return this.#player;
  }

  tile() {
    return this.#tile;
  }

  setTile(tile) {
    this.#tile = tile;
  }

  visibility() {
    const [unitYield] = this.yield(new Visibility());

    return unitYield;
  }

  waiting() {
    return this.#waiting;
  }

  setWaiting(waiting = true) {
    this.#waiting = waiting;
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
