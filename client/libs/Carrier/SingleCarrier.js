import { CARRIER_TYPE_SINGLE } from "../../../common/constants";
import CarrierBase from "./CarrierBase";

export default class SingleCarrier extends CarrierBase {
  constructor(id) {
    const type = CARRIER_TYPE_SINGLE;
    super({ id, type });
    const part = null;
    Object.assign(this.userData, {
      part,
    });
  }
  add(part) {
    const { part: prevPart } = this.userData;
    if (prevPart) {
      this.remove(part);
    }
    this.userData.part = part;
    super.add(part);
  }
  remove(part) {
    if (part == this.userData.part) {
      this.userData.part = null;
      super.remove(part);
    }
  }
}