import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartMouth extends FacePartBase {
  constructor({ faceResource }) {
    super({ faceResource });
    const { geometries, materials } = faceResource;
    const mouthMesh = new THREE.Mesh(geometries.mouth, materials.normal);
    mouthMesh.position.z = Z_OFFSET_PART;
    this.add(mouthMesh);
  }
}