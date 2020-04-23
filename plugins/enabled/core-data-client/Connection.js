export class Connection {
  send() {
    throw new TypeError('Connection#send must be implemented.');
  }
}

export default Connection;
