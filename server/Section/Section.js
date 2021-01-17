import * as THREE from "three";


export default class Section {
  constructor(position) {
    const id = THREE.MathUtils.generateUUID();
    const segments = [];
    const owner = null;
    const tags = [];

    Object.assign(this, {
      position,
      id,
      segments,
      owner,
      tags,
    });
  }
  //Balkingパターン
  enter(object) {
    if (this.owner != null) {
      return false;
    }
    this.owner = object;
    return true;
  }
  leave(object) {
    if (this.owner != object) {
      throw new Error("this.owner!=object");
    }
    this.owner = null;

  }

}