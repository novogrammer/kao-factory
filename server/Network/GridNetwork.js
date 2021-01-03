import * as THREE from "three";
import Section from "../Section/Section";

import NetworkBase from "./NetworkBase";
export default class GridNetwork extends NetworkBase {
  constructor(xQty, zQty, l) {
    super();
    const sections = [];
    for (let iz = 0; iz < zQty; ++iz) {
      for (let ix = 0; ix < xQty; ++ix) {
        const position = new THREE.Vector3(
          (ix - (xQty - 1) / 2) * l,
          0,
          (iz - (zQty - 1) / 2) * l
        );
        const section = new Section(position);
        sections.push(section);
      }
    }
    this.sections = sections;
    const getIndex = (ix, iz) => {
      return xQty * iz + ix;
    }
    for (let iz = 0; iz < zQty; ++iz) {
      for (let ix = 0; ix < xQty; ++ix) {
        const index = getIndex(ix, iz);
        if (0 < iz) {
          const indexPrev = getIndex(ix, iz - 1);
          this.assignSectionEachOther(indexPrev, index);
        }
        if (0 < ix) {
          const indexPrev = getIndex(ix - 1, iz);
          this.assignSectionEachOther(indexPrev, index);
        }
      }
    }
  }
}