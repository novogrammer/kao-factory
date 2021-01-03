import * as THREE from "three";

import LineSegment from "../Segment/LineSegment";
import CubicBezierSegment from "../Segment/CubicBezierSegment";

export default class NetworkBase {
  constructor() {
    this.sections = [];
  }
  assignSection(indexFrom, indexTo) {
    const { sections } = this;
    const from = sections[indexFrom];
    const to = sections[indexTo];
    const segment = new LineSegment({ from, to });
    // const segment=new CubicBezierSegment({
    //   from,
    //   to,
    //   controlPointFrom:from.position.clone().add(new THREE.Vector3(Math.random()-0.5,0,Math.random()-0.5)),
    //   controlPointTo:to.position.clone().add(new THREE.Vector3(Math.random()-0.5,0,Math.random()-0.5)),
    // })；
    from.segments.push(segment);
  }
  assignSectionEachOther(indexFrom, indexTo) {
    this.assignSection(indexFrom, indexTo);
    this.assignSection(indexTo, indexFrom);
  }

}