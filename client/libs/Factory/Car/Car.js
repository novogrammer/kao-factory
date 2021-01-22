import * as THREE from "three";
import {
  makeCube,
} from "../../three_utils";

import gsap from "gsap";
import { CAR_HEIGHT } from "../../../../common/constants";


// const UP_VECTOR = new THREE.Vector3(0, 1, 0);
// const ZERO_VECTOR = new THREE.Vector3(0, 0, 0);

export default class Car extends THREE.Group {
  constructor(id) {
    super();
    let body = null;
    {
      let geometry = new THREE.BoxGeometry(1, CAR_HEIGHT, 1);
      let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
      });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.y += CAR_HEIGHT / 2;
      body = mesh;

    }
    const head = makeCube(0.2, 0xff0000);
    head.position.z = -0.5;
    body.add(head);
    this.add(body);
    const carrier = null;
    this.userData = {
      head,
      body,
      id,
      carrier,
    };

  }
  turn({ duration, from, to }) {
    const rotationParams = {
      progress: 0,
      from: {
        quaternion: new THREE.Quaternion().copy(from.quaternion),
      },
      to: {
        quaternion: new THREE.Quaternion().copy(to.quaternion),
      },
    };
    gsap.to(rotationParams, duration, {
      progress: 1, onUpdate: () => {
        THREE.Quaternion.slerp(
          rotationParams.from.quaternion,
          rotationParams.to.quaternion,
          this.quaternion,
          rotationParams.progress
        );
      }
    });

  }
  move({ duration, from, to }) {
    const positionParams = {
      progress: 0,
      from: {
        position: new THREE.Vector3().copy(from.position),
      },
      to: {
        position: new THREE.Vector3().copy(to.position),
      },
    };
    const v = new THREE.Vector3();
    gsap.to(positionParams, duration, {
      progress: 1,
      onUpdate: () => {
        v.lerpVectors(
          positionParams.from.position,
          positionParams.to.position,
          positionParams.progress
        );
        this.position.copy(v);
      },
    });
  }
}
