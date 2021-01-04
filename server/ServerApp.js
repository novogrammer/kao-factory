import * as fs from "fs";
import express from "express";
import * as http from "http";
import * as https from "https";
import socketIo from "socket.io";
import next from "next";
import * as crypto from "crypto";

import EventEmitter from 'events';

import {
  ROOM_ENTRY,
  ROOM_FACTORY,
  EVENT_NOTIFY_UPLOAD_FACE,
  EVENT_NOTIFY_NEW_FACE,
  EVENT_NOTIFY_INITIALIZE,
  EVENT_NOTIFY_CAR_TURN,
  EVENT_NOTIFY_CAR_MOVE,
  INLET_FACES_QTY,
  FPS_SERVER,
} from "../common/constants";

import {
  fromVector3ToObject,
  fromQuaternionToObject,
} from "../common/socket_io_converter";


// import OsakaGridNetwork from "./Network/OsakaGridNetwork";

import OsakaSociety from "./Society/OsakaSociety";

const isHttps = false;

const serverKeyPath = 'cert/server-key.pem';
const serverCrtPath = 'cert/server-crt.pem';
const port = 3000;
const dev = process.env.NODE_ENV !== 'production'

export default class ServerApp {
  constructor() {
    this.faces = [];
    this.inletFaces = [];
    this.inletFaceNextIndex = 0;
    this.emitter = new EventEmitter();
    this.setupPromise = this.setupAsync();
  }
  async setupAsync() {
    const app = express();
    this.app = app;
    let server = null;
    if (isHttps) {
      const options = {
        key: fs.readFileSync(serverKeyPath),
        cert: fs.readFileSync(serverCrtPath),
      };
      server = https.createServer(options, app);
    } else {
      server = http.createServer(app);
    }
    this.server = server;

    this.setupSocketIo();
    await this.setupNextAsync();

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on ${isHttps ? "https" : "http"}://localhost:${port}`)
    });

    this.emitter.on(EVENT_NOTIFY_CAR_TURN, this.onNotifyCarTurn.bind(this));
    this.emitter.on(EVENT_NOTIFY_CAR_MOVE, this.onNotifyCarMove.bind(this));
    this.society = new OsakaSociety({
      emitter: this.emitter,
    });

    setInterval(() => {
      this.onTick();
    }, 1000 / FPS_SERVER);
  }
  setupSocketIo() {
    const { server } = this;
    const io = socketIo(server);
    this.io = io;

    io.on('connect', this.onConnect.bind(this));
  }
  async setupNextAsync() {
    const { app } = this;
    const nextApp = next({ dev });
    const nextHandler = nextApp.getRequestHandler()
    await nextApp.prepare();
    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });

  }
  onConnect(socket) {
    console.log("ServerApp#onConnect");
    const { handshake } = socket;
    const { room } = handshake.query;


    socket.on("disconnect", (reason) => {
      console.log("disconnect reason:" + reason);
    });

    switch (room) {
      case ROOM_ENTRY:
        this.setupEntryRoom(socket);
        break;
      case ROOM_FACTORY:
        this.setupFactoryRoom(socket);
        break;
      default:
        console.log("no room");
        socket.emit('now', {
          message: 'zeit',
        });
        break;
    }

  }
  setupEntryRoom(socket) {
    socket.join(ROOM_ENTRY);
    console.log("join room:" + ROOM_ENTRY);

    socket.on(EVENT_NOTIFY_UPLOAD_FACE, this.onNotifyUploadFace.bind(this, socket));

  }
  setupFactoryRoom(socket) {
    socket.join(ROOM_FACTORY);
    console.log("join room:" + ROOM_FACTORY);
    {
      const faces = this.faces.map((face, place) => {
        const { hash } = face;
        return {
          place,
          hash,
        };
      });
      const cars = this.society.cars.map((car) => {
        const id = car.uuid;
        const position = fromVector3ToObject(car.position);
        const quaternion = fromQuaternionToObject(car.quaternion);
        return {
          id,
          position,
          quaternion,
        };
      });
      socket.emit(EVENT_NOTIFY_INITIALIZE, {
        faces,
        cars,
      });
    }

  }
  onNotifyUploadFace(socket, { image, prediction }) {
    const hash = this.makeMd5(image);
    const face = {
      hash,
      image,
      prediction,
    };
    this.faces.push(face);
    const place = this.inletFaceNextIndex;
    this.inletFaces[place] = face;
    this.inletFaceNextIndex = (this.inletFaceNextIndex + 1) % INLET_FACES_QTY;

    this.io.to(ROOM_FACTORY).emit(EVENT_NOTIFY_NEW_FACE, {
      place,
      hash,
    });

    // console.log(image);
    // const j = JSON.stringify(prediction);
    // console.log(image.length, j.length);

  }
  makeMd5(str) {
    const md5 = crypto.createHash('md5');
    return md5.update(str, 'binary').digest('hex');
  }
  onTick() {
    this.society.update(1 / FPS_SERVER);
  }
  onNotifyCarTurn(params) {
    //そのまま渡す
    this.io.to(ROOM_FACTORY).emit(EVENT_NOTIFY_CAR_TURN, params);
  }
  onNotifyCarMove(params) {
    //そのまま渡す
    this.io.to(ROOM_FACTORY).emit(EVENT_NOTIFY_CAR_MOVE, params);
  }
}

