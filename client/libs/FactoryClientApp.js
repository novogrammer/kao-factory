import * as THREE from "three";
import {
  FPS_FACTORY,
  ROOM_FACTORY,
  EVENT_NOTIFY_NEW_FACE,
  EVENT_NOTIFY_INITIALIZE,
  EVENT_NOTIFY_CAR_TURN,
  EVENT_NOTIFY_CAR_MOVE,
} from "../../common/constants";

import ClientAppBase from "./ClientAppBase";

import ClientCar from "./ClientCar/ClientCar";

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
    const { view } = params;
    Object.assign(this, {
      view,
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


  }
  /**
   * @override
   */
  destorySocketIo() {
    const { socket } = this;
    socket.off(EVENT_NOTIFY_NEW_FACE, this.getBind("onNotifyNewFace"));
    super.destorySocketIo();
  }
  onNotifyNewFace({ place, hash }) {
    console.log(place, hash);
  }
  onNotifyInitialize({ faces, cars }) {
    console.log(faces.length, cars.length);

    const { clientCars, scene } = this.three;

    for (let car of cars) {
      const clientCar = new ClientCar(car.id);
      clientCar.position.copy(car.position);
      clientCar.quaternion.copy(car.quaternion);
      scene.add(clientCar);
      clientCars.push(clientCar);
    }
  }
  onNotifyCarTurn({ id, duration, from, to }) {
    const clientCar = this.findClientCar(id);
    clientCar.turn({ duration, from, to });
  }
  onNotifyCarMove({ id, duration, from, to }) {
    const clientCar = this.findClientCar(id);
    clientCar.move({ duration, from, to });
  }

  setupThree() {
    const { view } = this;

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

    const clientCars = [];


    camera.position.z = 10;
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


    this.three = {
      scene,
      camera,
      renderer,
      clientCars,
    };

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

  }
  render() {
    const {
      renderer,
      scene,
      camera,
    } = this.three;
    renderer.render(scene, camera);

  }
  findClientCar(id) {
    const { clientCars, scene } = this.three;
    return clientCars.find((clientCar) => clientCar.userData.id == id);
  }
}