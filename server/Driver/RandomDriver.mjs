import DriverBase from "./DriverBase";

export default class RandomDriver extends DriverBase {
  constructor({
    car,
    timeoutTime = Infinity,
    onTimeout = () => null,
  }) {
    const timeoutElapsedTime = 0;
    super({ car });
    Object.assign(this, {
      timeoutTime,
      onTimeout,
      timeoutElapsedTime,
    });
  }
  update(deltaTime) {
    const { car, timeoutTime, onTimeout } = this;
    const { section } = car.userData;
    const { segments } = section;
    if (car.userData.sectionTo == null) {

      const segment = segments[Math.floor(Math.random() * segments.length)];
      car.goNext(segment);
    }
    this.timeoutElapsedTime += deltaTime;
    if (timeoutTime < this.timeoutElapsedTime) {
      onTimeout();
    }
  }
}
