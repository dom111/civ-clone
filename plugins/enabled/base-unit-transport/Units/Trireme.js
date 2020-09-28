import {NavalTransport} from '../Types.js';

export class Trireme extends NavalTransport {
  capacity() {
    return 2;
  }
}

export default Trireme;
