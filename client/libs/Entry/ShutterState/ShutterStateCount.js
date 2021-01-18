import ShutterStateBase from "./ShutterStateBase";

export default class ShutterStateCount extends ShutterStateBase {
  constructor(context) {
    super(context);
    this.timeToLive = 3;
  }
  /**
   * @override
   */
  onBegin() {
    console.log("ShutterStateCount");
    this.updateCountText();
    this.context.countText.style.display = "block";

  }
  /**
   * @override
   */
  onEnd() {
    this.context.countText.style.display = "none";

  }
  /**
   * @override
   */
  onTick(deltaTime) {
    const { ShutterStateReady, ShutterStateRemain } = this.context.ClassMap;

    this.timeToLive -= deltaTime;
    this.updateCountText();
    if (this.context.faceCount == 0) {
      this.context.setNextShutterState(new ShutterStateReady(this.context));
    } else if (this.timeToLive < 0) {
      this.context.needsSend = true;
      this.context.setNextShutterState(new ShutterStateRemain(this.context));
    }

  }
  updateCountText() {
    const count = Math.ceil(Math.max(this.timeToLive, 0));
    this.context.countText.textContent = count;

  }
}