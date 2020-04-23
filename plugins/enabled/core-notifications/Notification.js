import Criterion from '../core-rules/Criterion.js';

export class Notification {
  /** @type {string} */
  #message;
  /** @type {string} */
  #name;
  /** @type {string} */
  #type;
  /** @type {boolean} */
  #when;

  /**
   *
   * @param message {string}
   * @param name {string}
   * @param type {string}
   * @param when {Criterion}
   */
  constructor({
    message,
    name,
    type,
    when = new Criterion(),
  }) {
    this.#message = message;
    this.#name    = name;
    this.#type    = type;
    this.#when    = when;
  }

  /**
   * @returns {string}
   */
  message() {
    return this.#message;
  }

  /**
   * @returns {string}
   */
  name() {
    return this.#name;
  }

  /**
   * @returns {string}
   */
  type() {
    return this.#type;
  }

  /**
   * @returns {boolean}
   */
  when() {
    // TODO: Rule/Criterion?
    return this.#when.validate();
  }
}

export default Notification;
