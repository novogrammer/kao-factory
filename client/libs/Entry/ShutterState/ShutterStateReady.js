import { FACE_SIZE_TO_ENTRY } from "../../../../common/constants";
import ShutterStateBase from "./ShutterStateBase";

export default class ShutterStateReady extends ShutterStateBase {
  constructor(context) {
    super(context);
  }
  /**
   * @override
   */
  onBegin() {
    console.log("ShutterStateReady");
    this.context.noFace.style.display = "block";
  }
  /**
   * @override
   */
  onEnd() {
    this.context.noFace.style.display = "none";

  }
  /**
   * @override
   */
  onTick(deltaTime) {
    const { ShutterStateCount } = this.context.ClassMap;

    if (0 < this.context.faceCount && FACE_SIZE_TO_ENTRY <= this.context.faceSize) {
      this.context.setNextShutterState(new ShutterStateCount(this.context));
    }
  }
}