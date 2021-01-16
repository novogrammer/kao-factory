import * as THREE from "three";
import {
  FPS_FACTORY,
  ROOM_FACTORY,
  EVENT_NOTIFY_NEW_FACE,
  EVENT_NOTIFY_INITIALIZE,
  EVENT_NOTIFY_CAR_TURN,
  EVENT_NOTIFY_CAR_MOVE,
  EVENT_REQUEST_FACE,
  EVENT_RESPONSE_FACE,
} from "../../common/constants";

import ClientAppBase from "./ClientAppBase";

import Car from "./Car/Car";

import FaceResource from "./Face/FaceResource";

import InletFace from "./Face/InletFace";

import {
  makeCube,
  makeArrow,
} from "./three_utils";

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
    socket.on(EVENT_NOTIFY_NEW_FACE, this.getBind("onNotifyNewFace"));
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
    socket.off(EVENT_NOTIFY_NEW_FACE, this.getBind("onNotifyNewFace"));
    socket.off(EVENT_NOTIFY_INITIALIZE, this.getBind("onNotifyInitialize"))

    socket.off(EVENT_NOTIFY_CAR_TURN, this.getBind("onNotifyCarTurn"));
    socket.off(EVENT_NOTIFY_CAR_MOVE, this.getBind("onNotifyCarMove"));

    socket.off(EVENT_RESPONSE_FACE, this.getBind("onResponseFace"));

    super.destorySocketIo();
  }
  onNotifyNewFace({ place, hash }) {
    console.log("onNotifyNewFace", place, hash);
    this.setupNewFace(place, hash);
  }
  onNotifyInitialize({ inletFaces: messageInletFaces, cars: messageCars, sections: messageSections }) {
    console.log("onNotifyInitialize", messageInletFaces.length, messageCars.length);

    const { cars, scene, arrows } = this.three;
    //再接続の時はゴミが残っている
    for (let car of cars) {
      scene.remove(car);
    }
    cars.length = 0;

    for (let arrow of arrows) {
      scene.remove(arrow);
    }
    arrows.length = 0;


    for (let { place, hash } of messageInletFaces) {
      this.setupNewFace(place, hash);
    }



    for (let messageCar of messageCars) {
      const car = new Car(messageCar.id);
      car.position.copy(messageCar.position);
      car.quaternion.copy(messageCar.quaternion);
      scene.add(car);
      cars.push(car);
    }
    const sections = messageSections.map((messageSection) => {
      console.log(messageSection);
      const position = new THREE.Vector3().copy(messageSection.position);
      const { segments } = messageSection;
      return {
        position,
        segments,
      };
    });
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

    const inletFaces = [];
    const cars = [];
    const arrows = [];

    this.three = {
      scene,
      camera,
      renderer,
      cars,
      inletFaces,
      arrows,
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
    const { inletFaces, camera } = this.three;
    const z = new THREE.Vector3();
    const v = camera.getWorldPosition(z);
    for (let inletFace of inletFaces) {
      // inletFace.lookAt(v);
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
  setupNewFace(place, hash) {
    const { inletFaces, scene } = this.three;

    const faceResourcePromise = this.getFaceResourceAsync(hash);

    faceResourcePromise.then((faceResource) => {
      const prevInletFace = inletFaces[place];
      if (prevInletFace) {
        scene.remove(prevInletFace);
      }
      const inletFace = new InletFace({ faceResource });
      inletFace.position.x = place * 4;

      inletFaces[place] = inletFace;
      scene.add(inletFace);

    });
  }
  updatePosition(position) {
    const { camera } = this.three;
    camera.position.copy(position);
    this.position = position;

  }
}