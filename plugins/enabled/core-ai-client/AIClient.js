import Client from '../core-client/Client.js';

export class AIClient extends Client {
  /**
   * @param choices {Civilization[]}
   */
  chooseCivilization(choices) {
    const Random = choices[Math.floor(choices.length * Math.random())],
      player = this.player()
    ;

    player.civilization = new Random();

    this.chooseLeader(player.civilization);
  }

  /**
   * @param civilization{Civilization}
   */
  chooseLeader(civilization) {
    this.player()
      .leader = civilization.leaders[Math.floor(civilization.leaders.length * Math.random())]
    ;
  }
}

export default AIClient;
