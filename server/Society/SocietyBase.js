import * as THREE from "three";

export default class SocietyBase {
  constructor({ emitter }) {
    const cars = [];
    const sections = [];
    const commanders = [];
    const carriers = [];
    const faces = {};
    const inletFaces = [];
    const inletFaceNextIndex = 0;

    Object.assign(this, {
      emitter,
      cars,
      commanders,
      sections,
      carriers,
      faces,
      inletFaces,
      inletFaceNextIndex,
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