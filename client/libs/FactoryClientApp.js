import {
  FPS_FACTORY,
  ROOM_FACTORY,
} from "../../common/constants";

import ClientAppBase from "./ClientAppBase";

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
}