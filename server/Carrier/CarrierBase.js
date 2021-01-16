
import * as THREE from "three";

export default class Carrier {
  constructor({ type }) {
    const id = THREE.MathUtils.generateUUID();
    Object.assign(this, {
      id,
      type,
    });
  }
  toObject() {
    const { id, type } = this;
    return {
      id,
      type,
    };
  }
  add(part) {
  }
  remove(part) {
  }
  getAllParts() {
    return [];
  }
}