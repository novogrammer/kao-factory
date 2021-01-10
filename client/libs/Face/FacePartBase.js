import * as THREE from "three";

export default class FacePartBase extends THREE.Group {
  constructor({ faceResource }) {
    super();
    Object.assign(this, {
      faceResource,
    });

  }
}