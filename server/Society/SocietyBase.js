import * as THREE from "three";
import { INLET_FACES_QTY } from "../../common/constants";

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
  addFace(face) {
    if (!face) {
      return;
    }
    const { hash } = face;
    this.faces[hash] = face;
  }
  getFace(hash) {
    const face = this.faces[hash];
    return face;
  }
  getInletFace(place) {
    const face = this.inletFaces[place];
    return face;
  }
  setInletFace(place, face) {
    this.addFace(face);
    this.inletFaces[place] = face;
    //TODO: このあたりでpartの入れ替えをする

  }
  newInletFace(face) {
    this.setInletFace(this.inletFaceNextIndex, face);
    this.inletFaceNextIndex = (this.inletFaceNextIndex + 1) % INLET_FACES_QTY;
  }
  update(deltaTime) {
    const { cars } = this;
    for (let car of cars) {
      car.update(deltaTime);
    }
  }
}