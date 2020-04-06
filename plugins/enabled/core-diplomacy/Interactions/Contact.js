import Interaction from '../Interaction.js';

export class Contact extends Interaction {
  constructor(...units) {
    const players = units.map((unit) => unit.player());

    super(...players);
  }
}

export default Contact;
