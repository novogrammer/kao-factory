import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  PART_KIND_RIGHT_EYE,
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartRightEye extends FacePartBase {
  constructor({ id, faceResourcePromise }) {
    const kind = PART_KIND_RIGHT_EYE;
    super({ id, kind, faceResourcePromise });
  }
  /**
   * @override
   */
  async setupAsync() {
    await super.setupAsync();
    const faceResource = await this.userData.faceResourcePromise;

    const { geometries, materials } = faceResource;
    const rightEyeMesh = new THREE.Mesh(geometries.rightEye, materials.normal);
    rightEyeMesh.position.z = Z_OFFSET_PART;
    this.add(rightEyeMesh);
  }
}