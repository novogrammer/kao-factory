
import Stats from "stats-js";
import * as animate from 'animate';

export default class EntryApp{
  constructor({video,view}){
    Object.assign(this,{
      video,
      view,
    });

    this.setupPromise=this.setupAsync();
  }
  async setupAsync(){
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
    let animationState="ready";
    this.animation=animate(async ()=>{
      if(animationState!="ready"){
        // console.log("skip frame");
        return;
      }
      animationState="executing";
      //async call
      let promise=this.onTickAsync();
      promise.then(()=>{
        animationState="ready";
      });
    },60);

  }
  destroyEvents(){
    this.animation.pause();
  }
  async onTickAsync(){
    const {stats}=this;
    stats.begin();



    stats.end();
  }
}