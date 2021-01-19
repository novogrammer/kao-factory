

import { PART_KIND_NOSE } from "../../common/constants";
import PartBase from "./PartBase";

export default class PartNose extends PartBase {
  constructor(hash) {
    const kind = PART_KIND_NOSE;
    super({ hash, kind });
  }
  // carrierは共有しない
  clone() {
    const part = new PartNose(this.hash);
    return part;
  }
}
