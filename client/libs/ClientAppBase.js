import Stats from "stats-js";
import * as animate from 'animate';
import io from 'socket.io-client';

export default class ClientAppBase {
  constructor(params) {
    this.binds = {};
    this.setupPromise = this.setupAsync(params);
  }
  getBind(methodName) {
    let bind = this.binds[methodName];
    if (!bind) {
      bind = this[methodName].bind(this);
      this.binds[methodName] = bind;
    }
    return bind;
  }
  async setupAsync(params) {
    const { fps } = params;
    Object.assign(this, {
      fps,
    });

    this.setupStats();
    this.setupSocketIo();
    this.setupEvents();
  }
  async destroyAsync() {
    //setupが終わってからdestroy
    await this.setupPromise;
    this.destroyEvents();
    this.destroySocketIo();
    this.destroyStats();
  }
  setupStats() {
    const stats = new Stats();
    // stats.dom.id="Stats";
    stats.dom.style.left = "auto";
    stats.dom.style.right = "0";
    document.body.appendChild(stats.dom);
    this.stats = stats;
  }
  destroyStats() {
    const { stats } = this;
    stats.dom.remove();
  }
  setupSocketIo() {
    this.socket = io();
    const { socket } = this;
    socket.on("connect", this.getBind("onConnect"));
    socket.on("disconnect", this.getBind("onDisconnect"));
  }
  destroySocketIo() {
    const { socket } = this;
    socket.off("disconnect", this.getBind("onDisconnect"));
    socket.off("connect", this.getBind("onConnect"));
    socket.close();
  }
  setupEvents() {
    const { stats, fps } = this;
    const onTickAsyncInternal = async () => {
      stats.begin();
      await this.onTickAsync();
      stats.end();
    };


    let animationState = "ready";
    this.animation = animate(async () => {
      if (animationState != "ready") {
        // console.log("skip frame");
        return;
      }
      animationState = "executing";
      //async call
      let promise = onTickAsyncInternal();
      promise.then(() => {
        animationState = "ready";
      });
    }, fps);

  }
  destroyEvents() {
    this.animation.pause();
  }
  async onTickAsync() {
    //DO NOTHING
  }
  onConnect() {
    console.log("EntryApp#onConnect");
  }
  onDisconnect() {
    console.log("EntryApp#onDisconnect");
    //DO NOTHING
  }
}
