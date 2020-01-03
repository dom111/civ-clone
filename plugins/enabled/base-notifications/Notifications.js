import Notification from './Notification.js';

export class Notifications {
  static notifications = [];

  static add(notification) {
    if (! (notification instanceof Notification)) {
      throw new TypeError(`Invalid notification: '${notification}'.`);
    }

    this.notifications.push(notification);
  }

  static check() {
    const notifications = this.notifications.filter((notification) => {
      if (('when' in notification) && (
        typeof notification.when === 'function')
      ) {
        return notification.when(notification);
      }
      else {
        return true;
      }
    });

    this.notifications = this.notifications.filter(
      (notification) => ! notifications.includes(notification)
    );

    notifications.forEach((notification) => this.display(notification));
  }

  // TODO: This should be a concern of the renderer
  static display(notification) {
    if (! (notification instanceof Notification)) {
      throw new TypeError(`Invalid notification: '${notification}'.`);
    }

    console.log(`${notification.name}: ${notification.message}`);
  }
}

export default Notifications;