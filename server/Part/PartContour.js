

import { PART_KIND_CONTOUR } from "../../common/constants";
import PartBase from "./PartBase";

export default class PartContour extends PartBase {
  constructor(hash) {
    const kind = PART_KIND_CONTOUR;
    super({ hash, kind });
  }
  // carrierは共有しない
  clone() {
    const part = new PartContour(this.hash);
    return part;
  }
}
