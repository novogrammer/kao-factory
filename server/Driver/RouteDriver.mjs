import DriverBase from "./DriverBase";

export default class RouteDriver extends DriverBase {
  constructor({
    car,
    sections,
    isLoop = false,
    onComplete = () => null,
    stuckTime = Infinity,
    onStuck = () => null,
  }) {
    super({ car });
    const sectionIndex = 0;
    const stuckElapsedTime = 0;
    Object.assign(this, {
      sections,
      isLoop,
      onComplete,
      stuckTime,
      onStuck,
      sectionIndex,
      stuckElapsedTime,
    });
  }
  update(deltaTime) {
    const { car, sections, sectionIndex, isLoop, onComplete, stuckTime, onStuck } = this;
    const { section } = car.userData;
    const { segments } = section;
    if (car.userData.sectionTo == null) {
      const nextSection = sections[sectionIndex];
      const segment = segments.find((segment) => segment.to == nextSection);
      if (!segment) {
        throw new Error("segment not found");
      }
      if (car.goNext(segment)) {
        this.stuckElapsedTime = 0;
        this.sectionIndex += 1;
        if (sections.length <= this.sectionIndex) {
          if (isLoop) {
            this.sectionIndex = 0;
          } else {
            onComplete();
          }
        }
      } else {
        this.stuckElapsedTime += deltaTime;
        if (stuckTime <= this.stuckElapsedTime) {
          onStuck();
        }
      }
    } else {
      this.stuckElapsedTime = 0;
    }

  }
}
