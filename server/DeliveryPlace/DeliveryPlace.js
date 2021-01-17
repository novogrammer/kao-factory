
import * as THREE from "three";

export default class DeliveryPlace {
  constructor() {
    const id = THREE.MathUtils.generateUUID();
    const sections = [];
    const carrier = null;
    Object.assign(this, {
      id,
      sections,
      carrier,
    });

  }
  toObject() {
    const { id, sections, carrier } = this;
    let sectionIds = sections.map((section) => section.id);
    let carrierId = null;
    if (carrier) {
      carrierId = carrier.id;
    }
    return {
      id,
      sectionIds,
      carrierId,
    };
  }
}