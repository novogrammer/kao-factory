import Stats from "stats-js";
import * as animate from 'animate';

export default class ClientAppBase{
  constructor(params){
    this.setupPromise=this.setupAsync(params);
  }
  async setupAsync(params){
    const {fps}=params;
    Object.assign(this,{
      fps,
    });

    this.setupStats();
    this.setupEvents();
  }
  async destroyAsync(){
    //setupが終わってからdestroy
    await this.setupPromise;
    this.destroyEvents();
    this.destroyStats();
  }
  setupStats(){
    const stats=new Stats();
    // stats.dom.id="Stats";
    stats.dom.style.left="auto";
    stats.dom.style.right="0";
    document.body.appendChild(stats.dom);
    this.stats=stats;
  }
  destroyStats(){
    const {stats}=this;
    stats.dom.remove();
  }
  setupEvents(){
    const {stats,fps}=this;
    const onTickAsyncInternal=async ()=>{
      stats.begin();
      await this.onTickAsync();
      stats.end();
    };


    let animationState="ready";
    this.animation=animate(async ()=>{
      if(animationState!="ready"){
        // console.log("skip frame");
        return;
      }
      animationState="executing";
      //async call
      let promise=onTickAsyncInternal();
      promise.then(()=>{
        animationState="ready";
      });
    },fps);

  }
  destroyEvents(){
    this.animation.pause();
  }
  async onTickAsync(){
  }

}
