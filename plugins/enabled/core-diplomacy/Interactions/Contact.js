import Interaction from '../Interaction.js';

export class Contact extends Interaction {
  /**
   * @param units {Unit}
   */
  constructor(...units) {
    const players = units.map((unit) => unit.player());

    super(...players);
  }
}

export default Contact;
