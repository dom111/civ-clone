'use strict';

if ('comabt' in engine.Unit) {
    console.log('Combat module ' + engine.Unit.combat.package + ' already loaded, skipping base-combat');
}
else {
    var combatModifiers = {
        attack: {
            veteran: .5
        },
        defence: {
            river: .5,
            fortified: 1,
            mountain: 2,
            hills: 1,
            fort: 1.5
        }
    };

    extend(engine.Unit, {
        combat: {
            package: 'base-combat',
            resolve: (attacker, defender) => {
                return (this.getAttack(attacker) * Math.random()) > (this.getDefence(defender) * Math.random());
            },
            getAttack: (unit) => {
                var attack = unit.attack;

                Object.keys(combatModifiers.attack).forEach((key) => attack += unit[key] ? (unit.attack * combatModifiers.attack[key]) : 0)

                return attack;
            },
            getDefence: (unit) => {
                var defence = unit.defence;

                Object.keys(combatModifiers.defence).forEach((key) => defence += unit[key] ? (unit.defence * combatModifiers.defence[key]) : 0)

                return defence;
            }
        }
    });
}
