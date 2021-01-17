import * as THREE from "three";

export default class PartBase extends THREE.Group {
  constructor({ id, kind, faceResourcePromise }) {
    super();
    this.userData = {
      id,
      kind,
      faceResourcePromise,
    };

    const setupPromise = this.setupAsync();
    Object.assign(this.userData, {
      setupPromise,
    });

  }
  async setupAsync() {

  }
}