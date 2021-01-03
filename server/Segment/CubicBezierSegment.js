import * as THREE from "three";

import SegmentBase from "./SegmentBase";

export default class CubicBezierSegment extends SegmentBase {
  constructor({ from, to, controlPointFrom, controlPointTo }) {
    const curve = new THREE.CubicBezierCurve3(from.position, controlPointFrom, controlPointTo, to.position);
    super({
      curve,
      from,
      to,
    });
    Object.assign(this, {
      controlPointFrom,
      controlPointTo,
    });
  }

}