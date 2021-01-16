import * as THREE from "three";



export default class CarrierBase extends THREE.Group {
  constructor({ id, type }) {
    super();
    this.userData = {
      id,
      type,
    };
  }
  add(part) {
    super.add(part);
  }
  remove(part) {
    super.remove(part);
  }

}

