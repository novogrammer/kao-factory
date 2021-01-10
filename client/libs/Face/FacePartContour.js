import * as THREE from "three";
import FacePartBase from "./FacePartBase";

import {
  Z_OFFSET_MASK,
} from "../../../common/constants";


export default class FacePartContour extends FacePartBase {
  constructor({ faceResource }) {
    super({ faceResource });
    const { geometries, materials } = faceResource;
    const contourMesh = new THREE.Mesh(geometries.contour, materials.normal);
    this.add(contourMesh);

    const leftEyeMesh = new THREE.Mesh(geometries.leftEye, materials.nopperi);
    leftEyeMesh.position.z = Z_OFFSET_MASK;
    this.add(leftEyeMesh);

    const rightEyeMesh = new THREE.Mesh(geometries.rightEye, materials.nopperi);
    rightEyeMesh.position.z = Z_OFFSET_MASK;
    this.add(rightEyeMesh);

    const noseMesh = new THREE.Mesh(geometries.nose, materials.nopperi);
    noseMesh.position.z = Z_OFFSET_MASK;
    this.add(noseMesh);

    const mouthMesh = new THREE.Mesh(geometries.mouth, materials.nopperi);
    mouthMesh.position.z = Z_OFFSET_MASK;
    this.add(mouthMesh);




  }
}