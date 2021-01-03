import * as THREE from "three";

import SegmentBase from "./SegmentBase";
export default class LineSegment extends SegmentBase {
  constructor({ from, to }) {
    const curve = new THREE.LineCurve3(from.position, to.position);
    super({
      curve,
      from,
      to,
    });
  }

}