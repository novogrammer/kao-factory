

import { PART_KIND_NOSE } from "../../common/constants";
import PartBase from "./PartBase";

export default class PartNose extends PartBase {
  constructor(hash) {
    const kind = PART_KIND_NOSE;
    super({ hash, kind });
  }
}
