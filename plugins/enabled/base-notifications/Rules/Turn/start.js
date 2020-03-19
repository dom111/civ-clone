import Effect from '../../../core-rules/Effect.js';
import NotificationRegistry from '../../../core-notifications/NotificationRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  notificationRegistry = NotificationRegistry.getInstance(),
} = {}) => [
  new Rule(
    'turn:start:notifications',
    new Effect(() => notificationRegistry.check()
      .forEach((notification) => console.log(`${notification.name}: ${notification.message}`))
    )
  ),
];

export default getRules;
