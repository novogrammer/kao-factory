import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartLeftEye extends FacePartBase {
  constructor({ faceResource }) {
    super({ faceResource });
    const { geometries, materials } = faceResource;
    const leftEyeMesh = new THREE.Mesh(geometries.leftEye, materials.normal);
    leftEyeMesh.position.z = Z_OFFSET_PART;
    this.add(leftEyeMesh);
  }
}