

import { PART_KIND_LEFT_EYE } from "../../common/constants";
import PartBase from "./PartBase";

export default class PartLeftEye extends PartBase {
  constructor(hash) {
    const kind = PART_KIND_LEFT_EYE;
    super({ hash, kind });
  }
  // carrierは共有しない
  clone() {
    const part = new PartLeftEye(this.hash);
    return part;
  }
}
