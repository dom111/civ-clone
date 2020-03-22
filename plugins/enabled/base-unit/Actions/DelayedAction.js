import Action from '../../core-unit/Action.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import Turn from '../../core-turn-based-game/Turn.js';

export class DelayedAction extends Action {
  perform({
    action = () => {},
    name,
    turn = Turn.getInstance(),
    turns,
  }) {
    const endTurn = turn.value() + turns;

    this.unit()
      .setActive(false)
    ;
    this.unit()
      .moves()
      .set(0)
    ;
    this.unit()
      .setBusy(new Rule(
        name,
        new Criterion(() => turn.value() === endTurn),
        new Effect((...args) => {
          const unit = this.unit();

          action(...args);
          unit.setActive();
          unit.setBusy();
          unit.moves(
            this.unit()
              .movement()
          );
        })
      ))
    ;
  }
}

export default DelayedAction;
