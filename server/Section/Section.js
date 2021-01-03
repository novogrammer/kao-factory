export default class Section {
  constructor(position) {
    Object.assign(this, {
      position,
    });
    this.segments = [];
    this.owner = null;
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