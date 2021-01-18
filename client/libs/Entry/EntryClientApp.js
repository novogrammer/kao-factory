import {
  FPS_ENTRY,
  ROOM_ENTRY,
  VIDEO_SIZE,
  EVENT_NOTIFY_UPLOAD_FACE,
  JPEG_QUALITY,
} from "../../../common/constants";

import ClientAppBase from "../ClientAppBase";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';

import * as tfjsWebgl from '@tensorflow/tfjs-backend-webgl';



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
    } = this;
    viewCtx.drawImage(
      videoImage,
      0, 0, VIDEO_SIZE, VIDEO_SIZE,
      0, 0, view.width, view.height
    );
    if (0 < predictions.length) {
      const prediction = predictions[0]
      const scaledKeypoints = prediction.scaledMesh;

      viewCtx.save();
      viewCtx.fillStyle = '#32EEDB';
      viewCtx.strokeStyle = '#32EEDB';
      viewCtx.lineWidth = 0.5;
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