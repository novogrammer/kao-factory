import * as THREE from "three";

export default class SocietyBase {
  constructor({ emitter }) {
    const cars = [];
    const sections = [];
    const commanders = [];
    const carriers = [];
    Object.assign(this, {
      emitter,
      cars,
      commanders,
      sections,
      carriers,
    });
    this.setup();
  }
  setup() {

  }
  update(deltaTime) {
    const { cars } = this;
    for (let car of cars) {
      car.update(deltaTime);
    }
  }
}