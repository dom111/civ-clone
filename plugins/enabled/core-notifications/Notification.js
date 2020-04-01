import Criterion from '../core-rules/Criterion.js';

export class Notification {
  #message;
  #name;
  #type;
  #when;

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

  message() {
    return this.#message;
  }

  name() {
    return this.#name;
  }

  type() {
    return this.#type;
  }

  when() {
    // TODO: Rule/Criterion?
    return this.#when.validate();
  }
}

export default Notification;
