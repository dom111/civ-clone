import Notification from './Notification.js';
import Notifications from './Notifications.js';

[
  'turn:start',
  'engine:build',
  'engine:initialise',
  'engine:plugins-loaded',
  'engine:settings-loaded',
  'engine:start',
  'world:built',
  'world:generate-start-tiles',
  'world:start-tiles',
].forEach((event) => engine.on(event, () => Notifications.check()));

engine.on('notification', (data) => {
  Notifications.add(data);
});

// basic entries
Object.entries({
  // 'city:build': (city, item) => `${city.name} is building ${item.name}.`,
  // 'city:building-complete': (city, item) => `${city.name} finished building ${item.constructor.name}.`,
  // 'city:captured': (city, player) => `${city.player.civilization.people} city of ${city.name} (${city.size}) captured by ${player.civilization.nation}.`,
  // 'city:created': (city) => `${city.player.civilization.people} city of ${city.name} (${city.tile.x},${city.tile.y}).`,
  // 'city:destroyed': (city) => `${city.player.civilization.people} city of ${city.name} (${city.tile.x},${city.tile.y}).`,
  // 'city:grow': (city) => `${city.player.civilization.people} city of ${city.name} has grown to (${city.size}).`,
  // 'city:shrink': (city) => `${city.player.civilization.people} city of ${city.name} has shrunk to (${city.size}).`,
  // 'city-improvement:built': (city, improvement) => `${city.player.civilization.people} city of ${city.name} has built a ${improvement.constructor.name}.`,
  'engine:build': () => '',
  'engine:initialise': () => '',
  'engine:plugins-loaded': () => '',
  'engine:settings-loaded': () => '',
  'engine:start': () => '',
  // 'player:turn-start': (player) => `${player.constructor.name} ${player.id} ${player.leader.name}'s (${player.civilization.nation}) turn.`,
  // 'player:defeated': (defeatedPlayer, attacker) => `${defeatedPlayer.civilization.people} civilization destroyed by ${attacker.civilization.nation}.`,
  // 'player:research': (player, Advance) => `${player.civilization.people} have started researching ${Advance.name}.`,
  // 'player:research-complete': (player, Advance) => `${player.civilization.people} have learned the secrets of ${Advance.constructor.name}.`,
  // 'tile:improvement-built': (tile, improvement) => `${improvement} built at ${tile.x}, ${tile.y} (${tile.terrain.constructor.name} - ${tile.terrain.name}).`,
  // 'time:year-updated': (year) => `${year < 0 ? `${-year} BC` : `${year} AD`}`,
  // 'turn:start': (Time) => `Turn Start: ${Time.turn}.`,
  // 'unit:created': (unit) => `${unit.player.civilization.people} ${unit.constructor.name}.`,
  // 'unit:destroyed': (unit) => `${unit.player.civilization.people} ${unit.constructor.name}.`,
  // 'unit:moved': (unit, from, to) => `${unit.player.civilization.people} ${unit.constructor.name} moved from ${from.x},${from.y} to ${to.x},${to.y} (${to.terrain.constructor.name}).`,
  'world:built': () => '',
  'world:generate-start-tiles': () => '',
  'world:start-tiles': () => '',
}).forEach(([event, messageProvider]) => engine.on(event, (...args) => engine.emit('notification', new Notification({
  name: event,
  message: messageProvider(...args),
}))));
