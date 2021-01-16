

import { PART_KIND_RIGHT_EYE } from "../../common/constants";
import PartBase from "./PartBase";

export default class PartRightEye extends PartBase {
  constructor(hash) {
    const kind = PART_KIND_RIGHT_EYE;
    super({ hash, kind });
  }
}
