

import CommanderBase from "./CommanderBase";

export default class RandomWalkCommander extends CommanderBase {
  constructor(args) {
    super(args);
    this.setup();
  }
  setup() {
    this.commandRandom();
  }

}