import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartRightEye extends FacePartBase {
  constructor({ faceResource }) {
    super({ faceResource });
    const { geometries, materials } = faceResource;
    const rightEyeMesh = new THREE.Mesh(geometries.rightEye, materials.normal);
    rightEyeMesh.position.z = Z_OFFSET_PART;
    this.add(rightEyeMesh);
  }
}