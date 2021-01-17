import {
  EVENT_NOTIFY_PART_ADDED,
  EVENT_NOTIFY_PART_REMOVED,
} from "../../common/constants";

import * as THREE from "three";

export default class Carrier {
  constructor({ type, emitter }) {
    const id = THREE.MathUtils.generateUUID();
    Object.assign(this, {
      id,
      type,
      emitter,
    });
  }
  toObject() {
    const { id, type } = this;
    return {
      id,
      type,
    };
  }
  add(part) {
  }
  remove(part) {
  }
  getAllParts() {
    return [];
  }
  emitAdded(part) {
    const { emitter } = this;
    const { id, hash, kind } = part;
    const carrierId = this.id;
    const params = {
      id,
      hash,
      kind,
      carrierId,
    };
    emitter.emit(EVENT_NOTIFY_PART_ADDED, params);
  }
  emitRemoved(part) {
    const { emitter } = this;
    const { id } = part;
    const carrierId = this.id;
    const params = {
      id,
      carrierId,
    };
    emitter.emit(EVENT_NOTIFY_PART_REMOVED, params);
  }
}