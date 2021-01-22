import * as THREE from "three";
import { INLET_FACES_QTY, PART_KIND_LIST } from "../../common/constants";
import PartContour from "../Part/PartContour";
import PartLeftEye from "../Part/PartLeftEye";
import PartMouth from "../Part/PartMouth";
import PartNose from "../Part/PartNose";
import PartRightEye from "../Part/PartRightEye";

export default class SocietyBase {
  constructor({ emitter }) {
    const cars = [];
    const sections = [];
    const commanders = [];
    const carriers = [];
    const deliveryPlaces = [];
    const faces = {};
    const inletFaces = [];
    const inletFaceNextIndex = 0;
    const inletCarriers = [];
    for (let i = 0; i < INLET_FACES_QTY; ++i) {
      inletFaces[i] = null;
      inletCarriers[i] = null;
    }

    Object.assign(this, {
      emitter,
      cars,
      commanders,
      sections,
      carriers,
      deliveryPlaces,
      faces,
      inletFaces,
      inletFaceNextIndex,
      inletCarriers,
    });
    this.setup();
  }
  setup() {

  }
  addFace(face) {
    if (!face) {
      return;
    }
    const { hash } = face;
    this.faces[hash] = face;
  }
  getFace(hash) {
    const face = this.faces[hash];
    return face;
  }
  getInletFace(place) {
    const face = this.inletFaces[place];
    return face;
  }
  filterSectionsByDeliveryPlace(deliveryPlace) {
    return this.sections.filter((section) => {
      return deliveryPlace.sections.some((sectionInDeliveryPlace) => sectionInDeliveryPlace == section);
    });
  }
  filterDeliveryPlaceByCarrier(carrier) {
    return this.deliveryPlaces.filter((deliveryPlace) => {
      return deliveryPlace.carrier == carrier;
    })
  }
  filterDeliveryPlaceBySection(section) {
    return this.deliveryPlaces.filter((deliveryPlace) => {
      return deliveryPlace.sections.some((sectionInDeliveryPlace) => sectionInDeliveryPlace == section);
    })

  }
  setInletFace(place, face) {
    this.addFace(face);
    this.inletFaces[place] = face;

    const partKindQty = PART_KIND_LIST.length;
    const PartClassList = [
      PartContour,
      PartLeftEye,
      PartRightEye,
      PartNose,
      PartMouth,
    ];
    if (partKindQty != PartClassList.length) {
      throw new Error("partKindQty != PartClassList.length");
    }
    for (let i = 0; i < partKindQty; ++i) {
      const carrier = this.inletCarriers[place];
      const PartClass = PartClassList[i];
      const part = new PartClass(face.hash);
      carrier.add(part);
    }

  }
  newInletFace(face) {
    this.setInletFace(this.inletFaceNextIndex, face);
    this.inletFaceNextIndex = (this.inletFaceNextIndex + 1) % INLET_FACES_QTY;
  }
  update(deltaTime) {
    const { cars } = this;
    for (let car of cars) {
      car.update(deltaTime);
    }
  }
}