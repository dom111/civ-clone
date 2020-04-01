import Notification from './Notification.js';
import Registry from '../core-registry/Registry.js';

export class NotificationRegistry extends Registry {
  constructor() {
    super(Notification);
  }

  check() {
    const notifications = this.filter((notification) => notification.when());

    this.unregister(...notifications);

    return notifications;
  }
}

export default NotificationRegistry;
