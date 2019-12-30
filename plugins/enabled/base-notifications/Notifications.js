export class Notifications {
  static notifications = [];

  static add(data) {
    this.notifications.push(data);
  }

  static check() {
    const notifications = this.notifications.filter((notification) => {
      if (('when' in notification) && (
        typeof notification.when === 'function')) {
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
    if (! notification) {
      throw new TypeError(`Invalid notification: '${notification}'.`);
    }

    if (notification.type === 'research') {
      // TODO: something different for different types of notifications?
      //  Could register a notificationHandler?
    }

    console.log(`${notification.name}: ${notification.message}`);
  }
}

export default Notifications;