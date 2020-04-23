import {Attack, Defence, Movement, Moves, Visibility} from './Yields.js';
import DataObject from '../core-data-object/DataObject.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class Unit extends DataObject {
  /** @type {boolean} */
  #active = true;
  /** @type {null} */
  #busy = null;
  /** @type {City} */
  #city;
  /** @type {boolean} */
  #destroyed = false;
  /** @type {Moves} */
  #moves = new Moves();
  /** @type {Player} */
  #player;
  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @tile {Tile} */
  #tile;
  /** @type {boolean} */
  #waiting = false;

  /**
   * @param player {Player}
   * @param city {City}
   * @param tile {Tile}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({player, city, tile, rulesRegistry = RulesRegistry.getInstance()}) {
    super({
      rulesRegistry,
    });

    this.#city   = city;
    this.#player = player;
    this.#tile   = tile;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('unit:created', this);
  }

  /**
   * @param action {Action}
   * @param args
   */
  action({
    action,
    ...args
  } = {}) {
    return action.perform({
      ...args,
    });
  }

  /**
   * @param to {Tile}
   * @param from {Tile}
   * @returns {Action[]}
   */
  actions(to = this.#tile, from = this.#tile) {
    return this.#rulesRegistry.process('unit:action', this, to, from);
  }

  activate() {
    return this.#rulesRegistry.process('unit:activate', this);
  }

  /**
   * @returns {boolean}
   */
  active() {
    return this.#active;
  }

  /**
   * @param active {boolean}
   */
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

  /**
   * @returns {Attack}
   */
  attack() {
    const [unitYield] = this.yield(new Attack());

    return unitYield;
  }

  /**
   * @returns {null|Rule}
   */
  busy() {
    return this.#busy;
  }

  /**
   * @param rule {Rule}
   */
  setBusy(rule = null) {
    this.#busy = rule;
  }

  /**
   * @returns {City}
   */
  city() {
    return this.#city;
  }

  /**
   * @returns {Defence}
   */
  defence() {
    const [unitYield] = this.yield(new Defence());

    return unitYield;
  }

  destroy(player = null) {
    this.#rulesRegistry.process('unit:destroyed', this, player);
  }

  /**
   * @returns {boolean}
   */
  destroyed() {
    return this.#destroyed;
  }

  setDestroyed() {
    this.#destroyed = true;
  }

  /**
   * @returns {String[]}
   */
  keys() {
    return [
      'active',
      'attack',
      'busy',
      'city',
      'defence',
      'movement',
      'moves',
      'player',
      'tile',
      'waiting',
      ...super.keys(),
    ];
  }

  /**
   * @returns {Movement}
   */
  movement() {
    const [unitYield] = this.yield(new Movement());

    return unitYield;
  }

  /**
   * @returns {Moves}
   */
  moves() {
    return this.#moves;
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }

  /**
   * @returns {Tile}
   */
  tile() {
    return this.#tile;
  }

  /**
   * @param tile {Tile}
   */
  setTile(tile) {
    this.#tile = tile;
  }

  /**
   * @returns {Visibility}
   */
  visibility() {
    const [unitYield] = this.yield(new Visibility());

    return unitYield;
  }

  /**
   * @returns {boolean}
   */
  waiting() {
    return this.#waiting;
  }

  setWaiting(waiting = true) {
    this.#waiting = waiting;
  }

  /**
   * @param yields {...Yield}
   * @returns {Yield[]}
   */
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
