import Notification from './Notification.js';
import Notifications from './Notifications.js';

engine.on('turn:start', () => {
  Notifications.check();
});

engine.on('notification', (data) => {
  Notifications.add(data);
});

// basic entries
Object.entries({
  // 'city:build': (city, item) => `${city.name} is building ${item.name}.`,
  // 'city:built': (city, item) => `${city.name} finished building ${item.name}.`,
  'city:created': (city) => `${city.player.civilization.people} city of ${city.name} (${city.tile.x},${city.tile.y}).`,
  // 'city:grow': (city) => `${city.player.civilization.people} city of ${city.name} has grown to (${city.size}).`,
  // 'city:shrink': (city) => `${city.player.civilization.people} city of ${city.name} has shrunk to (${city.size}).`,
  // 'player:turn-start': (player) => `${player.constructor.name} ${player.id} ${player.leader.name}'s (${player.civilization.nation}) turn.`,
  // 'tile:improvement-built': (tile, improvement) => `${improvement} built at ${tile.x}, ${tile.y} (${tile.terrain.constructor.name} - ${tile.terrain.name}).`,
  'time:year-updated': (year) => `${year < 0 ? `${-year} BC` : `${year} AD`}`,
  // 'turn:start': (Time) => `Turn Start: ${Time}.`,
  // 'unit:created': (unit) => `${unit.player.civilization.people} ${unit.constructor.name}.`,
  // 'unit:destroyed': (unit) => `${unit.player.civilization.people} ${unit.constructor.name}.`,
  // 'unit:moved': (unit, from, to) => `${unit.player.civilization.people} ${unit.constructor.name} moved from ${from.x},${from.y} to ${to.x},${to.y} (${to.terrain.constructor.name}).`
}).forEach(([event, messageProvider]) => engine.on(event, (...args) => engine.emit('notification', new Notification({
  name: event,
  message: messageProvider(...args),
}))));
