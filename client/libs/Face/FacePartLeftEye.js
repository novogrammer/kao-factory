import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  PART_KIND_LEFT_EYE,
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartLeftEye extends FacePartBase {
  constructor({ id, faceResourcePromise }) {
    const kind = PART_KIND_LEFT_EYE;
    super({ id, kind, faceResourcePromise });
  }
  /**
   * @override
   */
  async setupAsync() {
    await super.setupAsync();
    const faceResource = await this.userData.faceResourcePromise;

    const { geometries, materials } = faceResource;
    const leftEyeMesh = new THREE.Mesh(geometries.leftEye, materials.normal);
    leftEyeMesh.position.z = Z_OFFSET_PART;
    this.add(leftEyeMesh);

  }
}