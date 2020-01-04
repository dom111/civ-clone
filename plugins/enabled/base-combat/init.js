import Unit from '../core-unit/Unit.js';

const combatModifiers = {
  attack: {
    veteran: .5,
  },
  defence: {
    river: .5,
    fortified: 1,
    mountain: 2,
    hills: 1,
    fort: 1.5,
  },
};

// TODO: make this a baseClass and implementation
Object.defineProperty(Unit, 'combat', {
  value: {
    package: 'base-combat',
    resolve: (attacker, defender) => {
      return (Unit.combat.getAttack(attacker) * Math.random()) > (Unit.combat.getDefence(defender) * Math.random());
    },
    getAttack: (unit) => {
      let {attack} = unit;

      Object.keys(combatModifiers.attack).forEach((key) => attack += unit[key] ? (unit.attack * combatModifiers.attack[key]) : 0);

      return attack;
    },
    getDefence: (unit) => {
      let {defence} = unit;

      Object.keys(combatModifiers.defence).forEach((key) => defence += unit[key] ? (unit.defence * combatModifiers.defence[key]) : 0);

      return defence;
    },
  },
});
