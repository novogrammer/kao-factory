

import CommanderBase from "./CommanderBase";

const DRIVING_STATE_GO = "go";
const DRIVING_STATE_BREAK = "break";

const STUCK_TIME = 1;
const BREAK_TIME = 1;

export default class TourCommander extends CommanderBase {
  constructor(args) {
    super(args);
    const { places } = args;
    if (places.length < 2) {
      throw new Error("placesが少なすぎます");
    }
    for (let place of places) {
      const { section, onArrival } = place;
      if (!section) {
        throw new Error("sectionがありません");
      }
      if (!onArrival) {
        throw new Error("onArrivalがありません");
      }
    }

    Object.assign(this, {
      targetPlaceIndex: null,
      drivingState: null,
      places,
    })
    this.setup();
  }
  setup() {
    this.targetPlaceIndex = 0;
    this.drivingState = DRIVING_STATE_GO;
    const targetPlace = this.getTargetPlace();
    this.commandDestination(targetPlace.section, STUCK_TIME);
  }
  getTargetPlace() {
    const { places, targetPlaceIndex } = this;
    const place = places[targetPlaceIndex];
    if (!place) {
      throw new Error("placeがありません");
    }
    return place;
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
    const prevTargetPlace = this.getTargetPlace();
    prevTargetPlace.onArrival();
    this.targetPlaceIndex = (this.targetPlaceIndex + 1) % this.places.length;
    const nextTargetPlace = this.getTargetPlace();
    this.commandDestination(nextTargetPlace.section, STUCK_TIME);
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
    const targetPlace = this.getTargetPlace();
    this.commandDestination(targetPlace.section, STUCK_TIME);

  }
}
