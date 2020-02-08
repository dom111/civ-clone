(() => {
    'use strict';

    extend(engine, {
        Notifications: {
            notifications: [],

            add(data) {
                this.notifications.push(data);
            },

            check() {
                const self = this;

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
                    (notification) => !notifications.includes(notification));

                notifications.forEach((notification) => {
                    self.display(notification);
                });
            },

            display(notification) {
                if (notification.type === 'research') {
                    /** @todo something different for different types of notifications */
                }

                console.log(notification.name + ': ' + notification.message);
            }
        }
    });

    engine.on('turn-start', () => {
        engine.Notifications.check();
    });

    engine.on('notification', (data) => {
        engine.Notifications.add(data);
    });
})();
