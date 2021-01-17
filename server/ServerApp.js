import * as fs from "fs";
import express from "express";
import * as http from "http";
import * as https from "https";
import socketIo from "socket.io";
import next from "next";
import * as crypto from "crypto";

import EventEmitter from 'events';

import {
  ROOM_DEBUG,
  ROOM_ENTRY,
  ROOM_FACTORY,
  EVENT_NOTIFY_LOAD_INLET_FACES,
  EVENT_NOTIFY_SAVE_INLET_FACES,
  EVENT_NOTIFY_DISPLAY_ERROR_LOG,
  EVENT_NOTIFY_CLEAR_ERROR_LOG,
  EVENT_NOTIFY_UPLOAD_FACE,
  EVENT_NOTIFY_INITIALIZE,
  EVENT_NOTIFY_CAR_TURN,
  EVENT_NOTIFY_CAR_MOVE,
  EVENT_REQUEST_FACE,
  EVENT_RESPONSE_FACE,
  INLET_FACES_QTY,
  FPS_SERVER,
  FILEPATH_INLET_FACES_JSON,
  FACES_DIR,
  CARRIER_TYPE_MULTIPLE,
  CARRIER_TYPE_SINGLE,
} from "../common/constants";

import {
  fromVector3ToObject,
  fromQuaternionToObject,
} from "../common/socket_io_converter";


// import OsakaGridNetwork from "./Network/OsakaGridNetwork";

import OsakaSociety from "./Society/OsakaSociety";
import OsakaLayersSociety from "./Society/OsakaLayersSociety";
import SimpleFactorySociety from "./Society/SimpleFactorySociety";
import PartContour from "./Part/PartContour";
import PartLeftEye from "./Part/PartLeftEye";
import PartRightEye from "./Part/PartRightEye";
import PartNose from "./Part/PartNose";
import PartMouth from "./Part/PartMouth";

const isHttps = false;

const serverKeyPath = 'cert/server-key.pem';
const serverCrtPath = 'cert/server-crt.pem';
const port = 3000;
const dev = process.env.NODE_ENV !== 'production'

export default class ServerApp {
  constructor() {
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

    this.society = new SimpleFactorySociety({
      emitter: this.emitter,
    });

    try {
      this.loadInletFaces();
    } catch (error) {
      console.error(error);
    }

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
      case ROOM_DEBUG:
        console.log("debug!!!");
        this.setupDebugRoom(socket);
        break;
      case ROOM_ENTRY:
        this.setupEntryRoom(socket);
        break;
      case ROOM_FACTORY:
        this.setupFactoryRoom(socket);
        break;
      default:
        console.log("no room");
        console.log(handshake);
        break;
    }

  }
  setupDebugRoom(socket) {
    socket.join(ROOM_DEBUG);
    console.log("join room:" + ROOM_DEBUG);

    socket.on(EVENT_NOTIFY_LOAD_INLET_FACES, this.onNotifyLoadInletFaces.bind(this, socket));
    socket.on(EVENT_NOTIFY_SAVE_INLET_FACES, this.onNotifySaveInletFaces.bind(this, socket));

  }
  setupEntryRoom(socket) {
    socket.join(ROOM_ENTRY);
    console.log("join room:" + ROOM_ENTRY);

    socket.on(EVENT_NOTIFY_UPLOAD_FACE, this.onNotifyUploadFace.bind(this, socket));

  }
  setupFactoryRoom(socket) {
    socket.join(ROOM_FACTORY);
    console.log("join room:" + ROOM_FACTORY);


    socket.on(EVENT_REQUEST_FACE, this.onRequestFace.bind(this, socket));

    {
      const cars = this.society.cars.map((car) => {
        const id = car.uuid;
        const position = fromVector3ToObject(car.position);
        const quaternion = fromQuaternionToObject(car.quaternion);
        const { carrier } = car;
        let carrierId = null;
        if (carrier) {
          carrierId = carrier.id;
        }
        return {
          id,
          position,
          quaternion,
          carrierId,
        };
      });

      const sections = this.society.sections.map((section) => {
        const segments = section.segments.map((segment) => {
          const indexTo = this.society.sections.findIndex((s) => s == segment.to);
          if (indexTo == -1) {
            throw new Error("segmentからsectionを解決できなかった");
          }
          return { indexTo };
        });
        const position = fromVector3ToObject(section.position);
        return {
          position,
          segments,
        };
      });

      const carriers = this.society.carriers.map((carrier) => {
        return carrier.toObject();
      });
      const parts = this.society.carriers.map((carrier) => {
        return carrier.getAllParts();
      }).flat().filter((part) => !!part).map((part) => {
        let carrierId = null;
        if (part.carrier) {
          carrierId = part.carrier.id;
        }
        return {
          id: part.id,
          hash: part.hash,
          kind: part.kind,
          carrierId,
        };
      });

      socket.emit(EVENT_NOTIFY_INITIALIZE, {
        cars,
        sections,
        carriers,
        parts,
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
    this.society.newInletFace(face);

  }
  onNotifyLoadInletFaces(socket) {
    console.log("onNotifyLoadInletFaces");
    try {
      this.loadInletFaces();
    } catch (error) {
      console.error(error);
    }
  }
  onNotifySaveInletFaces(socket) {
    console.log("onNotifySaveInletFaces");
    try {
      this.saveInletFaces();
    } catch (error) {
      console.error(error);
    }
  }
  makeMd5(str) {
    const md5 = crypto.createHash('md5');
    return md5.update(str, 'binary').digest('hex');
  }
  onTick() {
    this.society.update(1 / FPS_SERVER);
    // this.sendDisplayErrorLog({ text: "foo" })
  }
  onNotifyCarTurn(params) {
    //そのまま渡す
    this.io.to(ROOM_FACTORY).emit(EVENT_NOTIFY_CAR_TURN, params);
  }
  onNotifyCarMove(params) {
    //そのまま渡す
    this.io.to(ROOM_FACTORY).emit(EVENT_NOTIFY_CAR_MOVE, params);
  }
  loadFace(hash) {
    const faceFilepath = FACES_DIR + hash + ".json";
    const face = JSON.parse(fs.readFileSync(faceFilepath, 'utf8'));
    return face;
  }
  saveFace(face) {
    const {
      hash,
    } = face;
    const faceFilepath = FACES_DIR + hash + ".json";
    fs.writeFileSync(faceFilepath, JSON.stringify(face));
  }
  loadInletFaces() {
    const hashes = JSON.parse(fs.readFileSync(FILEPATH_INLET_FACES_JSON, 'utf8'));
    for (let i = 0; i < INLET_FACES_QTY; ++i) {
      const hash = hashes[i];
      if (!hash) {
        this.society.setInletFace(i, null);
      } else {
        const face = this.loadFace(hash);
        this.society.setInletFace(i, face);
      }
    }

  }
  saveInletFaces() {
    const hashes = [];
    for (let i = 0; i < INLET_FACES_QTY; ++i) {
      const inletFace = this.society.getInletFace(i);
      if (inletFace) {
        hashes.push(inletFace.hash);
        this.saveFace(inletFace);
      } else {
        hashes.push(null);
      }
    }
    fs.writeFileSync(FILEPATH_INLET_FACES_JSON, JSON.stringify(hashes));
  }
  sendDisplayErrorLog({ socket = null, text = "" } = {}) {
    let target = socket || this.io;
    target.emit(EVENT_NOTIFY_DISPLAY_ERROR_LOG, { text });
  }
  sendClearErrorLog({ socket = null } = {}) {
    let target = socket || this.io;
    target.emit(EVENT_NOTIFY_CLEAR_ERROR_LOG, {});

  }
  onRequestFace(socket, { hash }) {
    console.log("onRequestFace");
    const face = this.society.getFace(hash);
    if (face) {
      socket.emit(EVENT_RESPONSE_FACE, face);
    } else {
      console.log("onRequestFace face not found");
    }
  }
}

