import {
  FPS_ENTRY,
  ROOM_ENTRY,
  VIDEO_SIZE,
  EVENT_NOTIFY_UPLOAD_FACE,
  JPEG_QUALITY,
  FACE_SIZE_TO_ENTRY,
} from "../../../common/constants";

import ClientAppBase from "../ClientAppBase";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';

import * as tfjsWebgl from '@tensorflow/tfjs-backend-webgl';
// import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';


import { TRIANGULATION } from "./triangulation";

function drawPath(viewCtx, points, closePath) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  viewCtx.stroke(region);
}

import ShutterStateReady from "./ShutterState/ShutterStateReady";
import ShutterStateCount from "./ShutterState/ShutterStateCount";
import ShutterStateRemain from "./ShutterState/ShutterStateRemain";

export default class EntryClientApp extends ClientAppBase {
  constructor(params) {
    const paramsForSuper = Object.assign(
      {
        fps: FPS_ENTRY,
        room: ROOM_ENTRY,
      },
      params
    );
    super(paramsForSuper);
  }
  /**
   * @override
   */
  async setupAsync(params) {
    const {
      video,
      view,
      loading,
      flash,
      noFace,
      countText,
      remain,
    } = params;
    const needsSend = false;
    const faceCount = 0;
    const faceSize = 0;
    const ClassMap = {
      ShutterStateReady,
      ShutterStateCount,
      ShutterStateRemain,
    };
    const shutterState = null;
    Object.assign(this, {
      video,
      view,
      loading,
      flash,
      noFace,
      countText,
      remain,
      needsSend,
      faceCount,
      faceSize,
      ClassMap,
      shutterState,
    });
    this.setNextShutterState(new ShutterStateReady(this));
    await this.setupModelAsync();
    await this.setupCameraAsync();

    //onTickなどもあるので最後にする。
    //問題が起きれば実行順を数値で表すなどする。
    await super.setupAsync(params);

    view.addEventListener("click", this.getBind("onClickView"));
  }
  /**
   * @override
   */
  async destroyAsync() {
    //setupが終わってからdestroy
    await this.setupPromise;
    const { view } = this;
    view.removeEventListener("click", this.getBind("onClickView"));
    await super.destroyAsync();
    await this.destroyCameraAsync();
    await this.destroyModelAsync();

  }
  /**
   * @override
   */
  setupSocketIo() {
    super.setupSocketIo();
    const { socket } = this;
  }
  /**
   * @override
   */
  destorySocketIo() {
    const { socket } = this;
    super.destorySocketIo();
  }
  async setupCameraAsync() {
    const { video, view } = this;
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: VIDEO_SIZE,
        height: VIDEO_SIZE
      },
    });
    video.srcObject = stream;

    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve();
      };
    });
    video.play();
    view.width = VIDEO_SIZE;
    view.height = VIDEO_SIZE;
    const viewCtx = view.getContext("2d");
    viewCtx.translate(view.width, 0);
    viewCtx.scale(-1, 1);

    const videoImage = document.createElement('canvas');
    videoImage.width = VIDEO_SIZE;
    videoImage.height = VIDEO_SIZE;
    const videoImageCtx = videoImage.getContext("2d");


    Object.assign(this, {
      stream,
      viewCtx,
      videoImage,
      videoImageCtx,
    });
  }
  async destroyCameraAsync() {
    const { stream } = this;
    const tracks = stream.getTracks();
    for (const track of tracks) {
      track.stop();
    }

  }
  async setupModelAsync() {
    const packageConfig = {
      maxFaces: 1,
    };
    // tfjsWasm.setWasmPaths(
    //   `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`);
    // await tf.setBackend("wasm");
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      packageConfig
    );
    Object.assign(this, {
      model,
    });

  }
  async destroyModelAsync() {
    //DO NOTHING
  }
  /**
   * @override
   */
  async onTickAsync() {
    await super.onTickAsync();
    const {
      model,
      video,
      videoImage,
      videoImageCtx,
      socket,
      loading,
    } = this;

    videoImageCtx.drawImage(
      video,
      0, 0, VIDEO_SIZE, VIDEO_SIZE,
      0, 0, VIDEO_SIZE, VIDEO_SIZE
    );
    const predictions = await model.estimateFaces({
      input: videoImage,
    });
    this.faceCount = predictions.length;
    if (0 < predictions.length) {
      const prediction = predictions[0];
      const { boundingBox } = prediction;
      const { topLeft, bottomRight } = boundingBox;
      const [left, top] = topLeft;
      const [right, bottom] = bottomRight;
      this.faceSize = (bottom - top) / VIDEO_SIZE;
      console.log(this.faceSize);
    } else {
      this.faceSize = 0;
    }

    if (this.shutterState) {
      this.shutterState.onTick(1 / FPS_ENTRY);
    }

    if (this.needsSend && 0 < predictions.length) {
      this.needsSend = false;
      const image = videoImage.toDataURL("image/jpeg", JPEG_QUALITY);
      const prediction = predictions[0];
      socket.emit(EVENT_NOTIFY_UPLOAD_FACE, {
        image,
        prediction
      });
    }

    this.drawFaces(predictions);
    loading.style.display = "none";
  }
  drawFaces(predictions) {
    const {
      viewCtx,
      view,
      // video,
      videoImage,
      faceSize,
    } = this;
    viewCtx.drawImage(
      videoImage,
      0, 0, VIDEO_SIZE, VIDEO_SIZE,
      0, 0, view.width, view.height
    );
    if (0 < predictions.length) {
      viewCtx.save();
      if (FACE_SIZE_TO_ENTRY <= faceSize) {
        viewCtx.strokeStyle = '#00ffff';
        viewCtx.lineWidth = 0.5;

      } else {
        viewCtx.strokeStyle = '#ffffff';
        viewCtx.lineWidth = 0.25;
      }
      const prediction = predictions[0]
      const scaledKeypoints = prediction.scaledMesh;

      for (let j = 0; j < TRIANGULATION.length; j += 3) {
        const points = [
          TRIANGULATION[j + 0],
          TRIANGULATION[j + 1],
          TRIANGULATION[j + 2],
        ].map(index => scaledKeypoints[index]);

        drawPath(viewCtx, points, true);
      }
      viewCtx.restore();
    }



  }
  onClickView() {
    // console.log("click");

    this.needsSend = true;

  }
  setNextShutterState(nextShutterState) {
    const { shutterState: prevShutterState } = this;
    if (prevShutterState) {
      prevShutterState.onEnd();
    }
    this.shutterState = nextShutterState;
    nextShutterState.onBegin();
  }
}