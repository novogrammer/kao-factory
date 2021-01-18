import ShutterStateBase from "./ShutterStateBase";

import gsap from "gsap";


export default class ShutterStateRemain extends ShutterStateBase {
  constructor(context) {
    super(context);
  }
  /**
   * @override
   */
  onBegin() {
    console.log("ShutterStateRemain");
    gsap.fromTo(this.context.flash, { opacity: 1 }, { opacity: 0, duration: 1 });
    this.context.remain.style.display = "block";
  }
  /**
   * @override
   */
  onEnd() {
    this.context.remain.style.display = "none";
  }
  /**
   * @override
   */
  onTick(deltaTime) {
    const { ShutterStateReady } = this.context.ClassMap;
    if (this.context.faceCount == 0) {
      this.context.setNextShutterState(new ShutterStateReady(this.context));
    }

  }
}