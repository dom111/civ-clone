import Client from './Client.js';
import Registry from '../core-registry/Registry.js';

export class ClientRegistry extends Registry {
  constructor() {
    super(Client);
  }
}

export default ClientRegistry;
