import * as THREE from "three";
import {
  FPS_FACTORY,
  ROOM_FACTORY,
  EVENT_NOTIFY_INITIALIZE,
  EVENT_NOTIFY_CAR_TURN,
  EVENT_NOTIFY_CAR_MOVE,
  EVENT_REQUEST_FACE,
  EVENT_RESPONSE_FACE,
  CARRIER_TYPE_SINGLE,
  CARRIER_TYPE_MULTIPLE,
  PART_KIND_CONTOUR,
  PART_KIND_LEFT_EYE,
  PART_KIND_RIGHT_EYE,
  PART_KIND_NOSE,
  PART_KIND_MOUTH,
} from "../../common/constants";

import ClientAppBase from "./ClientAppBase";

import Car from "./Car/Car";

import FaceResource from "./Face/FaceResource";


import {
  makeCube,
  makeArrow,
} from "./three_utils";
import SingleCarrier from "./Carrier/SingleCarrier";
import MultipleCarrier from "./Carrier/MultipleCarrier";
import FacePartContour from "./Face/FacePartContour";
import FacePartLeftEye from "./Face/FacePartLeftEye";
import FacePartRightEye from "./Face/FacePartRightEye";
import FacePartNose from "./Face/FacePartNose";
import FacePartMouth from "./Face/FacePartMouth";

export default class FactoryClientApp extends ClientAppBase {
  constructor(params) {
    const paramsForSuper = Object.assign(
      {
        fps: FPS_FACTORY,
        room: ROOM_FACTORY,
      },
      params
    );
    super(paramsForSuper);
  }
  /**
   * @override
   */
  async setupAsync(params) {
    const { view, position } = params;
    const facePromiseAndResolveStore = {};
    const faceResourcePromiseStore = {};
    Object.assign(this, {
      view,
      position,
      facePromiseAndResolveStore,
      faceResourcePromiseStore,
    });

    this.setupThree();

    //onTickなどもあるので最後にする。
    //問題が起きれば実行順を数値で表すなどする。
    await super.setupAsync(params);
  }
  /**
   * @override
   */
  async destroyAsync() {
    //setupが終わってからdestroy
    await this.setupPromise;
    await super.destroyAsync();

    this.destroyThree();

  }
  /**
   * @override
   */
  setupSocketIo() {
    super.setupSocketIo();
    const { socket } = this;
    socket.on(EVENT_NOTIFY_INITIALIZE, this.getBind("onNotifyInitialize"))

    socket.on(EVENT_NOTIFY_CAR_TURN, this.getBind("onNotifyCarTurn"));
    socket.on(EVENT_NOTIFY_CAR_MOVE, this.getBind("onNotifyCarMove"));

    socket.on(EVENT_RESPONSE_FACE, this.getBind("onResponseFace"));


  }
  /**
   * @override
   */
  destorySocketIo() {
    const { socket } = this;
    socket.off(EVENT_NOTIFY_INITIALIZE, this.getBind("onNotifyInitialize"))

    socket.off(EVENT_NOTIFY_CAR_TURN, this.getBind("onNotifyCarTurn"));
    socket.off(EVENT_NOTIFY_CAR_MOVE, this.getBind("onNotifyCarMove"));

    socket.off(EVENT_RESPONSE_FACE, this.getBind("onResponseFace"));

    super.destorySocketIo();
  }
  onNotifyInitialize({
    cars: messageCars,
    sections: messageSections,
    carriers: messageCarriers,
    parts: messageParts,
  }) {

    console.log("onNotifyInitialize");

    const { scene } = this.three;
    //再接続の時はゴミが残っている
    for (let car of this.three.cars) {
      scene.remove(car);
    }

    for (let arrow of this.three.arrows) {
      scene.remove(arrow);
    }

    for (let carrier of this.three.carriers) {
      scene.remove(carrier);
    }




    const carriers = messageCarriers.map((messageCarrier) => {
      let carrier = null;
      switch (messageCarrier.type) {
        case CARRIER_TYPE_SINGLE:
          carrier = new SingleCarrier(messageCarrier.id);
          break;
        case CARRIER_TYPE_MULTIPLE:
          carrier = new MultipleCarrier(messageCarrier.id);
          break;
        default:
          throw new Error("unexpected messageCarrier.type:" + messageCarrier.type);
      }
      return carrier;
    });
    for (let carrier of carriers) {
      scene.add(carrier);
    }


    Object.assign(this.three, {
      carriers,
    });

    const cars = [];
    for (let messageCar of messageCars) {
      const car = new Car(messageCar.id);
      car.position.copy(messageCar.position);
      car.quaternion.copy(messageCar.quaternion);
      if (messageCar.carrierId) {
        const carrier = carriers.find((carrier) => carrier.userData.id == messageCar.carrierId);
        if (!carrier) {
          throw new Error("carrier not found messageCar.carrierId:" + messageCar.carrierId);
        }
        car.userData.carrier = carrier;
      }
      scene.add(car);
      cars.push(car);
    }
    Object.assign(this.three, {
      cars,
    });

    const sections = messageSections.map((messageSection) => {
      const position = new THREE.Vector3().copy(messageSection.position);
      const { segments } = messageSection;
      return {
        position,
        segments,
      };
    });
    const arrows = [];
    for (let section of sections) {
      const positionFrom = section.position;
      for (let segment of section.segments) {
        const { indexTo } = segment;
        let sectionTo = sections[indexTo];
        const positionTo = sectionTo.position;
        let arrow = makeArrow(positionFrom, positionTo);
        scene.add(arrow);
        arrows.push(arrow);
      }

    }
    Object.assign(this.three, {
      arrows,
    });





    const parts = messageParts.map((messagePart) => {
      //この処理は共通化できるはず
      const { id, hash, kind, carrierId } = messagePart;

      const faceResourcePromise = this.getFaceResourceAsync(hash);

      let part = null;
      switch (kind) {
        case PART_KIND_CONTOUR:
          part = new FacePartContour({ id, faceResourcePromise });
          break;
        case PART_KIND_LEFT_EYE:
          part = new FacePartLeftEye({ id, faceResourcePromise });
          break;
        case PART_KIND_RIGHT_EYE:
          part = new FacePartRightEye({ id, faceResourcePromise });
          break;
        case PART_KIND_NOSE:
          part = new FacePartNose({ id, faceResourcePromise });
          break;
        case PART_KIND_MOUTH:
          part = new FacePartMouth({ id, faceResourcePromise });
          break;
        default:
          throw new Error("unexpected kind:" + kind);
      }

      const carrier = carriers.find((carrier) => carrier.userData.id == carrierId);
      if (!carrier) {
        throw new Error("carrier not found");
      }
      carrier.add(part);

      return null;
    });

  }
  onNotifyCarTurn({ id, duration, from, to }) {
    const car = this.findCar(id);
    car.turn({ duration, from, to });
  }
  onNotifyCarMove({ id, duration, from, to }) {
    const car = this.findCar(id);
    car.move({ duration, from, to });
  }

  setupThree() {
    const { view, position } = this;

    const scene = new THREE.Scene();
    const size = this.getSize();
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      canvas: view,
    });
    renderer.setSize(size.width, size.height);

    // {
    //   const geometry = new THREE.BoxGeometry(1, 1, 1);
    //   const material = new THREE.MeshBasicMaterial({
    //     color: 0xff00ff,
    //   });
    //   const mesh = new THREE.Mesh(geometry, material);
    //   scene.add(mesh);

    // }




    camera.position.z = 20;
    camera.position.y = 20;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    {
      const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(ambientLight);

      const pointLightA = new THREE.PointLight(0xffffff, 1, 100);
      pointLightA.position.set(10, 10, 10);
      scene.add(pointLightA);
      const pointLightB = new THREE.PointLight(0xffffff, 1, 100);
      pointLightB.position.set(-10, 10, 10);
      scene.add(pointLightB);

    }

    const cars = [];
    const arrows = [];
    const carriers = [];

    this.three = {
      scene,
      camera,
      renderer,
      cars,
      arrows,
      carriers,
    };
    this.updatePosition(position);

  }
  destroyThree() {
    const {
      scene,
    } = this.three;
    scene.traverse((object3d) => {
      if (object3d instanceof THREE.Mesh) {
        const mesh = object3d;
        const { geometry, material } = mesh;
        geometry.dispose();
        material.dispose();
      }
    });
  }
  getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  /**
   * @override
   */
  onResize() {
    super.onResize();
    const size = this.getSize();
    const { camera, renderer } = this.three;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);

  }
  /**
   * @override
   */
  async onTickAsync() {
    await super.onTickAsync();
    this.update();
    this.render();
  }
  update() {
    const { carriers, camera, cars } = this.three;
    const zeroVector = new THREE.Vector3();
    const v = camera.getWorldPosition(zeroVector);
    for (let carrier of carriers) {
      carrier.lookAt(v);
    }

    for (let car of cars) {
      const { carrier } = car.userData;
      if (carrier) {
        carrier.position.copy(car.getWorldPosition(new THREE.Vector3()));
      }
    }


  }
  render() {
    const {
      renderer,
      scene,
      camera,
    } = this.three;
    renderer.render(scene, camera);

  }
  findCar(id) {
    const { cars, scene } = this.three;
    return cars.find((car) => car.userData.id == id);
  }
  getFaceAsync(hash) {
    const { socket } = this;
    let facePromiseAndResolve = this.facePromiseAndResolveStore[hash];
    if (!facePromiseAndResolve) {
      facePromiseAndResolve = {};
      facePromiseAndResolve.promise = new Promise((resolve) => {
        facePromiseAndResolve.resolve = resolve;
      });
      this.facePromiseAndResolveStore[hash] = facePromiseAndResolve;

      socket.emit(EVENT_REQUEST_FACE, {
        hash,
      });

    }
    return facePromiseAndResolve.promise;
  }
  getFaceResourceAsync(hash) {
    let faceResourcePromise = this.faceResourcePromiseStore[hash];
    if (!faceResourcePromise) {
      faceResourcePromise = new Promise((resolve) => {
        this.getFaceAsync(hash).then((face) => {
          resolve(new FaceResource(face));
        });
      });
      ;
      this.faceResourcePromiseStore[hash] = faceResourcePromise;
    }
    return faceResourcePromise;

  }
  onResponseFace(face) {
    const { hash } = face;
    console.log("onResponseFace", hash);
    let facePromiseAndResolve = this.facePromiseAndResolveStore[hash];
    facePromiseAndResolve.resolve(face);
  }
  updatePosition(position) {
    const { camera } = this.three;
    camera.position.copy(position);
    this.position = position;

  }
}