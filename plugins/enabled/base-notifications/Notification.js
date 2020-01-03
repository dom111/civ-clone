export class Notification {
  #message;
  #name;
  #type;
  #when;

  constructor({
    message,
    name,
    type,
    when
  }) {
    this.#message = message;
    this.#name    = name;
    this.#type    = type;
    this.#when    = when;
  }

  get message() {
    return this.#message;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get when() {
    return this.#when;
  }
}

export default Notification;
