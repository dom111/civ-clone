import Notification from '../../Notification.js';
import Notifications from '../../Notifications.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('engine:start', () => {
  const renderTurns = parseInt(engine.option('renderTurns', 1), 10),
    eventsToAnnounce = engine.option(
      'eventsToAnnounce',
      (renderTurns > 0) ?
        '' :
        [
          'city:building',
          'city:building-complete',
          'city:captured',
          'city:civil-disorder',
          'city:created',
          'city:destroyed',
          // 'city:grow',
          'city:leader-celebration',
          // 'city:shrink',
          // 'city:yield',
          'game:start',
          'player:defeated',
          'player:government:changed',
          'player:research',
          'player:research-complete',
          // 'player:yield',
          'time:year-updated',
          // 'unit:destroyed',
        ]
          .join(',')
    )
      .split(/,/)
  ;

  [
    'turn:start',
    // 'engine:initialise',
    // 'engine:plugins-loaded',
    // 'engine:settings-loaded',
    // 'engine:start',
    // 'world:built',
    // 'world:generate-start-tiles',
    // 'world:start-tiles',
  ]
    .forEach((event) => engine.on(event, () => Notifications.check()))
  ;

  engine.on('notification', (data) => {
    Notifications.add(data);
  });

  // basic entries
  Object.entries({
    'city:build': (city, item) => `${city.name} is building ${item.name}.`,
    'city:building-complete': (city, item) => `${city.name} finished building ${item.constructor.name}.`,
    'city:captured': (city, player) => `${city.player.civilization.people} city of ${city.name} (${city.size}) captured by ${player.civilization.nation}.`,
    'city:civil-disorder': (city) => `Civil disorder in ${city.player.civilization.people} city of ${city.name} (${city.size})!`,
    'city:created': (city) => `${city.player.civilization.people} city of ${city.name} (${city.tile.x},${city.tile.y}).`,
    'city:destroyed': (city) => `${city.player.civilization.people} city of ${city.name} (${city.tile.x},${city.tile.y}).`,
    'city:grow': (city) => `${city.player.civilization.people} city of ${city.name} has grown to (${city.size + 1}).`,
    'city:leader-celebration': (city) => `We love the leader day in ${city.player.civilization.people} city of ${city.name} (${city.size} )!`,
    'city:shrink': (city) => `${city.player.civilization.people} city of ${city.name} has shrunk to (${city.size - 1}).`,
    'city:yield': (cityYield, city) => `${city.player.civilization.people} city of ${city.name} provides ${cityYield.value()} ${cityYield.constructor.name}.`,
    'city-improvement:created': (improvement, city) => `${city.player.civilization.people} city of ${city.name} has built a ${improvement.constructor.name}.`,
    'game:start': () => `${RulesRegistry.entries().length} rules in play.`,
    // 'engine:initialise': () => '',
    // 'engine:plugins-loaded': () => '',
    // 'engine:settings-loaded': () => '',
    // 'engine:start': () => '',
    'player:turn-start': (player) => `${player.constructor.name} ${player.id} ${player.leader.name}'s (${player.civilization.nation}) turn.`,
    'player:defeated': (defeatedPlayer, attacker) => `${defeatedPlayer.civilization.people} civilization destroyed by ${attacker.civilization.nation}.`,
    'player:government:changed': (player, government) => `${player.civilization.nation} has formed a ${government.constructor.name}.`,
    'player:research': (player, Advance) => `${player.civilization.nation} have started researching ${Advance.name}.`,
    'player:research-complete': (player, advance) => `${player.civilization.nation} have discovered the secrets of ${advance.constructor.name}.`,
    'player:yield': (playerYield, player) => `${player.civilization.nation} acquires ${playerYield.value()} ${playerYield.constructor.name}.`,
    'tile:improvement-built': (tile, improvement) => `${improvement} built at ${tile.x}, ${tile.y} (${tile.terrain.constructor.name} - ${tile.terrain.name}).`,
    'time:year-updated': (year) => `${year < 0 ? `${-year} BC` : `${year} AD`}`,
    'turn:start': (Time) => `Turn Start: ${Time.turn}.`,
    'unit:created': (unit) => `${unit.player.civilization.people} ${unit.constructor.name}.`,
    'unit:destroyed': (unit) => `${unit.player.civilization.people} ${unit.constructor.name}.`,
    'unit:moved': (unit, from, to) => `${unit.player.civilization.people} ${unit.constructor.name} moved from ${from.x},${from.y} to ${to.x},${to.y} (${to.terrain.constructor.name}).`,
    // 'world:built': () => '',
    // 'world:generate-start-tiles': () => '',
    // 'world:start-tiles': () => '',
  })
    .filter(([event]) => eventsToAnnounce.includes(event))
    .forEach(([name, messageProvider]) =>
      engine.on(name, (...args) => engine.emit('notification', new Notification({
        name,
        message: messageProvider(...args),
      })))
    )
  ;
});
