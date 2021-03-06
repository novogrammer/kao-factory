

import { PART_KIND_MOUTH } from "../../common/constants";
import PartBase from "./PartBase";

export default class PartMouth extends PartBase {
  constructor(hash) {
    const kind = PART_KIND_MOUTH;
    super({ hash, kind });
  }
  // carrierは共有しない
  clone() {
    const part = new PartMouth(this.hash);
    return part;
  }
}
