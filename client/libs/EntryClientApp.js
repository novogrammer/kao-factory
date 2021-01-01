import {
  FPS_ENTRY,
  VIDEO_SIZE,
} from "../../common/constants";

import ClientAppBase from "./ClientAppBase";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';

import * as tfjsWebgl from '@tensorflow/tfjs-backend-webgl';



import { TRIANGULATION } from "./triangulation";

function drawPath(ctx, points, closePath) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

export default class EntryClientApp extends ClientAppBase {
  constructor(params) {
    const paramsForSuper = Object.assign(
      {
        fps: FPS_ENTRY,
      },
      params
    );
    super(paramsForSuper);
  }
  /**
   * @override
   */
  async setupAsync(params) {
    const { video, view } = params;
    Object.assign(this, {
      video,
      view,
    });
    await this.setupModelAsync();
    await this.setupCameraAsync();

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
    const ctx = view.getContext("2d");
    ctx.translate(view.width, 0);
    ctx.scale(-1, 1);

    Object.assign(this, {
      stream,
      ctx,
    });
  }
  async destroyCameraAsync() {
    const { stream } = this;

  }
  async setupModelAsync() {
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
    Object.assign(this, {
      model,
    });

  }
  async destroyModelAsync() {
    //DO NOTHING
  }
  async onTickAsync() {
    await super.onTickAsync();
    const {
      model,
      video,
    } = this;

    const predictions = await model.estimateFaces({
      input: video,
    });

    this.drawFaces(predictions);
  }
  drawFaces(predictions) {
    const {
      ctx,
      view,
      video,
    } = this;
    ctx.drawImage(
      video,
      0, 0, VIDEO_SIZE, VIDEO_SIZE,
      0, 0, view.width, view.height
    );
    for (let i = 0; i < predictions.length; i++) {
      const scaledKeypoints = predictions[i].scaledMesh;
      // const keypoints = predictions[i].mesh;

      ctx.save();
      ctx.fillStyle = '#32EEDB';
      ctx.strokeStyle = '#32EEDB';
      ctx.lineWidth = 0.5;
      for (let j = 0; j < TRIANGULATION.length; j += 3) {
        const points = [
          TRIANGULATION[j + 0],
          TRIANGULATION[j + 1],
          TRIANGULATION[j + 2],
        ].map(index => scaledKeypoints[index]);

        drawPath(ctx, points, true);
      }
      ctx.restore();
    }



  }
}