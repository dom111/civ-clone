import Notifications from './Notifications.js';

engine.on('turn-start', () => {
  Notifications.check();
});

engine.on('notification', (data) => {
  Notifications.add(data);
});