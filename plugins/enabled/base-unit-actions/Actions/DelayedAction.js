import Action from '../../core-unit-actions/Action.js';

export class DelayedAction extends Action {
  delayedAction({
    action,
    turns,
    status,
  }) {
    this.unit.actionOnComplete = action;
    this.unit.active = false;
    this.unit.busy = turns;
    this.unit.movesLeft = 0;
    this.unit.status = status;
  }
}