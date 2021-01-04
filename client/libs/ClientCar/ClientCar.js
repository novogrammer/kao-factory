import * as THREE from "three";
import {
  makeCube,
} from "../three_utils";


export default class ClientCar extends THREE.Group {
  constructor(id) {
    super();
    const body = makeCube(1, 0x00ff00);
    const head = makeCube(0.25, 0xff0000);
    head.position.z = -0.5;
    body.add(head);
    this.add(body);
    this.userData = {
      head,
      body,
      id
    };

  }
}
