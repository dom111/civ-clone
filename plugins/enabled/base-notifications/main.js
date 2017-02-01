'use strict';

extend(engine, {
    Notifications: {
        notifications: [],
        add: function(data) {
            this.notifications.push(data);
        },
        check: function() {
            var self = this;

            var notifications = this.notifications.filter(function(notification) {
                if ('when' in notification) {
                    return notification.when.call(notification);
                }
                else {
                    return true;
                }
            });

            this.notifications = this.notifications.filter(function(notification) {
                return !notifications.includes(notification);
            });

            notifications.forEach(function(notification) {
                self.display(notification);
            });
        },
        display: function(notification) {
            console.log(notification);
        }
    }
});

engine.on('turn-start', function() {
    engine.Notifications.check();
});
