import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  Z_OFFSET_PART,
} from "../../../common/constants";

export default class FacePartNose extends FacePartBase {
  constructor({ faceResource }) {
    super({ faceResource });
    const { geometries, materials } = faceResource;
    const noseMesh = new THREE.Mesh(geometries.nose, materials.normal);
    noseMesh.position.z = Z_OFFSET_PART;
    this.add(noseMesh);
  }
}