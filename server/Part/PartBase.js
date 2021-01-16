
import * as THREE from "three";

export default class PartBase {
  constructor({ hash, kind }) {
    const id = THREE.MathUtils.generateUUID();
    const carrier = null;
    Object.assign(this, {
      id,
      hash,
      kind,
      carrier,
    });
  }
}