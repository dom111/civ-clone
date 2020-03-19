import Notification from './Notification.js';
import Registry from '../core-registry/Registry.js';

export class NotificationRegistry extends Registry {
  constructor() {
    super(Notification);
  }
  check() {
    const notifications = this.filter((notification) => {
      if (typeof notification.when === 'function') {
        return notification.when(notification);
      }
      else {
        return true;
      }
    });

    this.unregister(...notifications);

    return notifications;
  }
}

export default NotificationRegistry;
