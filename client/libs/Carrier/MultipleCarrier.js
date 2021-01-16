import {
  CARRIER_TYPE_MULTIPLE,
  PART_KIND_CONTOUR,
  PART_KIND_LEFT_EYE,
  PART_KIND_RIGHT_EYE,
  PART_KIND_NOSE,
  PART_KIND_MOUTH,

} from "../../../common/constants";
import CarrierBase from "./CarrierBase";

export default class MultipleCarrier extends CarrierBase {
  constructor(id) {
    const type = CARRIER_TYPE_MULTIPLE;
    super({ id, type });
    const partContour = null;
    const partLeftEye = null;
    const partRightEye = null;
    const partNose = null;
    const partMouth = null;
    Object.assign(this.userData, {
      partContour,
      partLeftEye,
      partRightEye,
      partNose,
      partMouth,
    });
  }
  getPartName(part) {
    switch (part.userData.kind) {
      case PART_KIND_CONTOUR:
        return "partContour";
      case PART_KIND_LEFT_EYE:
        return "partLeftEye";
      case PART_KIND_RIGHT_EYE:
        return "partRightEye";
      case PART_KIND_NOSE:
        return "partNose";
      case PART_KIND_MOUTH:
        return "partMouth";
      default:
        throw new Error("unexpect part.kind:" + part.userData.kind);
    }

  }


  addWithPartName(part, name) {
    const prevPart = this.userData[name];
    if (prevPart) {
      this.remove(prevPart);
    }
    this.userData[name] = part;
  }
  removeWithPartName(part, name) {
    if (part == this.userData[name]) {
      this.userData[name] = null;
      return true;
    }
    return false;
  }

  add(part) {
    this.addWithPartName(part, this.getPartName(part));
    super.add(part);
  }
  remove(part) {
    const removed = this.removeWithPartName(part, this.getPartName(part));
    super.remove(part);
  }
}