import * as THREE from "three";



export default class DeliveryPlace extends THREE.Group {
  constructor(id) {
    super();
    const carrier = null;
    this.userData = {
      id,
      carrier,
    };
  }

}

