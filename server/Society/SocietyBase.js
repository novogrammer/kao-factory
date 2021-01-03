import * as THREE from "three";

export default class SocietyBase {
  constructor() {
    const cars = [];
    const sections = [];
    const commanders = [];
    Object.assign(this, {
      cars,
      commanders,
      sections,
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