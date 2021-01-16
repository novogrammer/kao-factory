import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  PART_KIND_NOSE,
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartNose extends FacePartBase {
  constructor({ id, faceResourcePromise }) {
    const kind = PART_KIND_NOSE;
    super({ id, kind, faceResourcePromise });
  }
  /**
   * @override
   */
  async setupAsync() {
    await super.setupAsync();
    const faceResource = await this.userData.faceResourcePromise;

    const { geometries, materials } = faceResource;
    const noseMesh = new THREE.Mesh(geometries.nose, materials.normal);
    noseMesh.position.z = Z_OFFSET_PART;
    this.add(noseMesh);
  }
}