import * as THREE from "three";

export default class SegmentBase {
  constructor({ curve, from, to }) {
    Object.assign(this, {
      curve,
      from,
      to,
    });
  }
  getPoint(t) {
    const { curve } = this;
    return curve.getPoint(t);
  }
  getTangent(t) {
    const { curve } = this;
    return curve.getTangent(t);
  }
  getLength() {
    const { curve } = this;
    return curve.getLength();
  }
  getTime() {
    //実績ベースで上書きしていく予定
    return 1;
  }


}