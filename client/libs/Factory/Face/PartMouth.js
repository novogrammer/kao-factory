import * as THREE from "three";
import PartBase from "./PartBase";

import {
  PART_KIND_MOUTH,
  Z_OFFSET_PART,
} from "../../../../common/constants";

export default class PartMouth extends PartBase {
  constructor({ id, faceResourcePromise }) {
    const kind = PART_KIND_MOUTH;
    super({ id, kind, faceResourcePromise });
  }
  /**
   * @override
   */
  async setupAsync() {
    await super.setupAsync();
    const faceResource = await this.userData.faceResourcePromise;

    const { geometries, materials } = faceResource;
    const mouthMesh = new THREE.Mesh(geometries.mouth, materials.normal);
    mouthMesh.position.z = Z_OFFSET_PART;
    this.add(mouthMesh);
  }
}