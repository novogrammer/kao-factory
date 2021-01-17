import * as THREE from "three";
import PartBase from "./PartBase";

import {
  PART_KIND_NOSE,
  Z_OFFSET_PART,
} from "../../../../common/constants";

export default class PartNose extends PartBase {
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