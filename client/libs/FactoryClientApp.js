
import ClientAppBase from "./ClientAppBase";

export default class FactoryClientApp extends ClientAppBase{
  constructor(params){
    super(params);
  }
  async setupAsync(params){
    const {view}=params;
    Object.assign(this,{
      view,
    });

    //onTickなどもあるので最後にする。
    //問題が起きれば実行順を数値で表すなどする。
    await super.setupAsync(params);
  }
  async destroyAsync(){
    //setupが終わってからdestroy
    await this.setupPromise;
    await super.destroyAsync();

  }
}