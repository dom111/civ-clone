import Action from '../../core-unit/Action.js';

export class DelayedAction extends Action {
  delayedAction({
    action,
    turns,
  }) {
    this.unit.actionOnComplete = action;
    this.unit.active = false;
    this.unit.busy = turns;
    this.unit.moves.set(0);
  }
}