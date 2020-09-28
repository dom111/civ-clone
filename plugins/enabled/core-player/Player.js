import MandatoryPlayerAction from './MandatoryPlayerAction.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class Player {
  /** @type {number} */
  static id = 0;

  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @type {Tileset} */
  #seenTiles = new Tileset();
  /** @type {PlayerWorld} */
  #world;

  // TODO: setter for this
  /** @type Civilization */
  civilization;

  /**
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({
    rulesRegistry = RulesRegistry.getInstance(),
  } = {}) {
    this.id = Player.id++;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('player:added', this);
  }

  /**
   * @returns {PlayerAction}
   */
  getAction() {
    const [action] = this.getActions();

    return action;
  }

  /**
   * @returns {PlayerAction[]}
   */
  getActions() {
    return this.#rulesRegistry.process('player:action', this)
      .flat()
    ;
  }

  /**
   * @returns {boolean}
   */
  hasActions() {
    return !! this.getAction();
  }

  /**
   * @returns {MandatoryPlayerAction}
   */
  getMandatoryAction() {
    const [action] = this.getMandatoryActions();

    return action;
  }

  /**
   * @returns {MandatoryPlayerAction[]}
   */
  getMandatoryActions() {
    return this.getActions()
      .filter((action) => action instanceof MandatoryPlayerAction)
    ;
  }

  /**
   * @returns {boolean}
   */
  hasMandatoryActions() {
    return this.getActions()
      .some((action) => action instanceof MandatoryPlayerAction)
    ;
  }

  /**
   * @returns {Tileset}
   */
  seenTiles() {
    return this.#seenTiles;
  }

  /**
   * @returns {PlayerWorld}
   */
  world() {
    return this.#world;
  }

  setWorld(world) {
    this.#world = world;
  }
}

export default Player;
