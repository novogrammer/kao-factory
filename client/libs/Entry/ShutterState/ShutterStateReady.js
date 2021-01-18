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

    if (0 < this.context.faceCount) {
      this.context.setNextShutterState(new ShutterStateCount(this.context));
    }
  }
}