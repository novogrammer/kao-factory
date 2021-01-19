


import {
  CARRIER_TYPE_MULTIPLE,
  PART_KIND_CONTOUR,
  PART_KIND_LEFT_EYE,
  PART_KIND_MOUTH,
  PART_KIND_NOSE,
  PART_KIND_RIGHT_EYE,
} from "../../common/constants";
import CarrierBase from "./CarrierBase";

export default class MultipleCarrier extends CarrierBase {
  constructor({ emitter }) {
    const type = CARRIER_TYPE_MULTIPLE;
    super({ type, emitter });
    const partContour = null;
    const partLeftEye = null;
    const partRightEye = null;
    const partNose = null;
    const partMouth = null;
    Object.assign(this, {
      partContour,
      partLeftEye,
      partRightEye,
      partNose,
      partMouth,
    });
  }
  // /**
  //  * @override
  //  */
  // toObject() {
  //   const {
  //     partContour,
  //     partLeftEye,
  //     partRightEye,
  //     partNose,
  //     partMouth,
  //   } = this;

  //   const toId = (part) => {
  //     let partId = null;
  //     if (part) {
  //       partId = part.id;
  //     }
  //     return partId;
  //   };
  //   const partContourId = toId(partContour);
  //   const partLeftEyeId = toId(partLeftEye);
  //   const partRightEyeId = toId(partRightEye);
  //   const partNoseId = toId(partNose);
  //   const partMouthId = toId(partMouth);

  //   const object = super.toObject();
  //   Object.assign(object, {
  //     partContourId,
  //     partLeftEyeId,
  //     partRightEyeId,
  //     partNoseId,
  //     partMouthId,
  //   });
  // }

  getPartName(part) {
    switch (part.kind) {
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
        throw new Error("unexpect part.kind:" + part.kind);
    }

  }

  addWithPartName(part, name) {
    const prevPart = this[name];
    if (prevPart) {
      this.remove(prevPart);
    }
    part.carrier = this;
    this[name] = part;
    this.emitAdded(part);
  }
  removeWithPartName(part, name) {
    if (part == this[name]) {
      part.carrier = null;
      this[name] = null;
      this.emitRemoved(part);
    }
  }

  add(part) {
    this.addWithPartName(part, this.getPartName(part));
  }
  remove(part) {
    this.removeWithPartName(part, this.getPartName(part));
  }
  getAllParts() {
    return [
      this.partContour,
      this.partLeftEye,
      this.partRightEye,
      this.partNose,
      this.partMouth,
    ];
  }

}