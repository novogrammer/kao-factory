import {
  CAR_ANGULAR_VELOCITY,
  CAR_VELOCITY,
  EVENT_NOTIFY_CAR_TURN,
  EVENT_NOTIFY_CAR_MOVE,
} from "../../common/constants";

import {
  fromVector3ToObject,
  fromQuaternionToObject,
} from "../../common/socket_io_converter";


import * as THREE from "three";

import gsap from "gsap";


const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const ZERO_VECTOR = new THREE.Vector3(0, 0, 0);

const CAR_MOVING_STATE_IDLE = "idle";
const CAR_MOVING_STATE_BUSY = "busy";

export default class Car extends THREE.Group {
  constructor({ emitter }) {
    super();
    this.userData = {
      emitter,
      section: null,
      sectionTo: null,
      driver: null,
      movingState: CAR_MOVING_STATE_IDLE,
      carrier: null,
    };
  }
  assign(driver) {
    Object.assign(this.userData, {
      driver,
    })
  }
  getSectionForNavigation() {
    let { section, sectionTo, movingState } = this.userData;
    switch (movingState) {
      case CAR_MOVING_STATE_IDLE:
        return section;
      case CAR_MOVING_STATE_BUSY:
        return sectionTo;
      default:
        return section;
    }

  }
  goNext(segment) {
    const { section, movingState, emitter } = this.userData;
    switch (movingState) {
      case CAR_MOVING_STATE_IDLE:
        {
          const neighbor = segment.to;
          if (!neighbor.enter(this)) {
            return false;
          }
          this.userData.movingState = CAR_MOVING_STATE_BUSY;
          this.userData.sectionTo = neighbor;
          const tl = gsap.timeline();
          let turnParamForEmit = {
            id: this.uuid,
            duration: null,
            from: null,
            to: null,
          };
          let moveParamForEmit = {
            id: this.uuid,
            duration: null,
            from: null,
            to: null,
          };
          {
            const tangent = segment.getTangent(0);
            const targetRotation = new THREE.Matrix4().lookAt(
              ZERO_VECTOR,
              tangent,
              UP_VECTOR
            );
            const rotationParams = {
              progress: 0,
              qFrom: this.quaternion.clone(),
              qTo: new THREE.Quaternion().setFromRotationMatrix(targetRotation),
            };

            const angle = rotationParams.qFrom.angleTo(rotationParams.qTo);
            const duration = angle / CAR_ANGULAR_VELOCITY;

            turnParamForEmit.from = {
              quaternion: fromQuaternionToObject(rotationParams.qFrom),
            };
            turnParamForEmit.to = {
              quaternion: fromQuaternionToObject(rotationParams.qTo),
            }

            if (THREE.MathUtils.degToRad(45) < angle) {
              tl.to(rotationParams, duration, {
                progress: 1, onUpdate: () => {
                  THREE.Quaternion.slerp(
                    rotationParams.qFrom,
                    rotationParams.qTo,
                    this.quaternion,
                    rotationParams.progress
                  );
                }
              });
              turnParamForEmit.duration = duration;
            } else {
              turnParamForEmit.duration = 0;

            }
          }
          {
            const duration = segment.getLength() / CAR_VELOCITY;
            const positionParams = {
              progress: 0,
            };
            const rotationMatrix = new THREE.Matrix4();

            moveParamForEmit.from = {
              position: fromVector3ToObject(segment.from.position),
            };
            moveParamForEmit.to = {
              position: fromVector3ToObject(segment.to.position),
            };
            moveParamForEmit.duration = duration;

            tl.to(positionParams, duration, {
              progress: 1,
              onUpdate: () => {
                const point = segment.getPoint(positionParams.progress);
                this.position.copy(point);
                const tangent = segment.getTangent(positionParams.progress);
                rotationMatrix.lookAt(
                  ZERO_VECTOR,
                  tangent,
                  UP_VECTOR
                );
                this.quaternion.setFromRotationMatrix(rotationMatrix);
              },
              onComplete: () => {
                section.leave(this);
                this.userData.section = this.userData.sectionTo;
                this.userData.sectionTo = null;
                this.userData.movingState = CAR_MOVING_STATE_IDLE;
              },
            });

          }
          emitter.emit(EVENT_NOTIFY_CAR_TURN, turnParamForEmit);
          setTimeout(() => {
            emitter.emit(EVENT_NOTIFY_CAR_MOVE, moveParamForEmit);
          }, turnParamForEmit.duration * 1000);


          return true;

        }
      case CAR_MOVING_STATE_BUSY:
        return false;
      default:
        //DO NOTHING
        return false;
    }
  }
  update(deltaTime) {
    const { driver } = this.userData;
    if (driver != null) {
      driver.update(deltaTime);
    }
  }
}