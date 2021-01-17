


import {
  CARRIER_TYPE_SINGLE,
} from "../../common/constants";
import CarrierBase from "./CarrierBase";

export default class SingleCarrier extends CarrierBase {
  constructor({ emitter }) {
    const type = CARRIER_TYPE_SINGLE;
    super({ type, emitter });
    const part = null;
    Object.assign(this, {
      part,
    });
  }
  // /**
  //  * @override
  //  */
  // toObject() {
  //   const { part } = this;
  //   const partId = null;
  //   if (part) {
  //     partId = part.id;
  //   }
  //   const object = super.toObject();
  //   Object.assign(object, {
  //     partId,
  //   });
  // }
  add(part) {
    const { emitter } = this;
    const { part: prevPart } = this;
    if (prevPart) {
      this.remove(prevPart);
    }
    part.carrier = this;
    this.part = part;

    this.emitAdded(part);
  }
  remove(part) {
    if (part == this.part) {
      part.carrier = null;
      this.part = null;
      this.emitRemoved(part);
    }
  }
  getAllParts() {
    return [this.part];
  }
}