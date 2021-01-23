import ShutterStateBase from "./ShutterStateBase";

import gsap from "gsap";
import { FACE_SIZE_TO_ENTRY } from "../../../../common/constants";


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
    if (!(0 < this.context.faceCount && FACE_SIZE_TO_ENTRY <= this.context.faceSize)) {
      this.context.setNextShutterState(new ShutterStateReady(this.context));
    }

  }
}