import Client from '../core-client/Client.js';

export class DataClient extends Client {
  /** @type {Connection} */
  #connection;

  /**
   * @param connection {Connection}
   * @param map {World}
   * @param player {Player}
   */
  constructor({
    connection,
    map,
    player,
  }) {
    super({
      map,
      player,
    });

    this.#connection = connection;
  }

  /**
   * @param data {Object}
   */
  send(data) {
    this.#connection.send(data);
  }

  /**
   * @inheritDoc
   */
  takeTurn() {
    // TODO: the client should be sent the map once it's built so it can render it, then any terrorforming or
    //  improvement creation should fire some event that updates tohe map. This means there'll need to be a aribitrary
    //  mechanism for sending state updates. The server can assume that the client has up-to-date information and that
    //  updates are valid when applied to it.
    const data = {
      player: this.player(),
      world: this.player()
        .world()
      ,
      actions: this.player()
        .getActions()
        .map((action) => {
          // TODO: convert to data representation
          //  This might be a lot easier if each PlayerAction was a derived action that has its own .toData() or
          //  something like that...

          return action;
        })
      ,
    };

    return new Promise((resolve, reject) => {
      try {
        this.send(data);

        this.receive(() => {
          if (! this.player()
            .hasMandatoryActions()
          ) {
            resolve();
          }
        });
      }
      catch (e) {
        reject(e);
      }
    });
  }
}

export default DataClient;
