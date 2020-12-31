import {FPS_ENTRY} from "../../common/constants";

import ClientAppBase from "./ClientAppBase";

export default class EntryClientApp extends ClientAppBase{
  constructor(params){
    const paramsForSuper=Object.assign(
      {
        fps:FPS_ENTRY,
      },
      params
    );
    super(paramsForSuper);
  }
  /**
   * @override
   */
  async setupAsync(params){
    const {video,view}=params;
    Object.assign(this,{
      video,
      view,
    });

    //onTickなどもあるので最後にする。
    //問題が起きれば実行順を数値で表すなどする。
    await super.setupAsync(params);
  }
  /**
   * @override
   */
  async destroyAsync(){
    //setupが終わってからdestroy
    await this.setupPromise;
    await super.destroyAsync();

  }
  /**
   * @override
   */
  setupSocketIo(){
    super.setupSocketIo();
    const {socket}=this;
  }
  /**
   * @override
   */
  destorySocketIo(){
    const {socket}=this;
    super.destorySocketIo();
  }
}