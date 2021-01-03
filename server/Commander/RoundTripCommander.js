

import CommanderBase from "./CommanderBase";

const TRIP_STATE_PING = "ping";
const TRIP_STATE_PONG = "pong";

const DRIVING_STATE_GO = "go";
const DRIVING_STATE_BREAK = "break";

const STUCK_TIME = 1;
const BREAK_TIME = 1;

export default class RoundTripCommander extends CommanderBase {
  constructor(args) {
    super(args);
    const { from, to } = args;

    Object.assign(this, {
      tripState: null,
      drivingState: null,
      from,
      to,
    })
    this.setup();
  }
  setup() {
    const { from, to } = this;
    this.tripState = TRIP_STATE_PING;
    this.drivingState = DRIVING_STATE_GO;
    this.commandDestination(to, STUCK_TIME);
  }
  getTargetSection() {
    const { from, to } = this;
    switch (this.tripState) {
      case TRIP_STATE_PING:
        return to;
      case TRIP_STATE_PONG:
        return from;
      default:
        throw new Error("unexpected trip state");
    }
  }
  onStuck() {
    super.onStuck();
    switch (this.drivingState) {
      case DRIVING_STATE_GO:
        //DO NOTHING
        break;
      case DRIVING_STATE_BREAK:
        console.log("DRIVING_STATE_BREAKなのにonStuck");
        break;
      default:
        throw new Error("unexpected driving state");
    }
    this.drivingState = DRIVING_STATE_BREAK;
    this.commandRandom(BREAK_TIME);

  }
  onComplete() {
    super.onComplete();
    switch (this.tripState) {
      case TRIP_STATE_PING:
        this.tripState = TRIP_STATE_PONG;
        break;
      case TRIP_STATE_PONG:
        this.tripState = TRIP_STATE_PING;
        break;
    }
    const targetSection = this.getTargetSection();
    this.commandDestination(targetSection, STUCK_TIME);
  }
  onTimeout() {
    super.onTimeout();
    switch (this.drivingState) {
      case DRIVING_STATE_GO:
        console.log("DRIVING_STATE_GOなのにonTimeout");
        break;
      case DRIVING_STATE_BREAK:
        //DO NOTHING
        break;
      default:
        throw new Error("unexpected driving state");
    }
    this.drivingState = DRIVING_STATE_GO;
    const targetSection = this.getTargetSection();
    this.commandDestination(targetSection, STUCK_TIME);

  }
}
