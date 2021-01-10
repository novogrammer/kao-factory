import * as THREE from "three";

import FacePartContour from "./FacePartContour";
import FacePartLeftEye from "./FacePartLeftEye";
import FacePartRightEye from "./FacePartRightEye";
import FacePartNose from "./FacePartNose";
import FacePartMouth from "./FacePartMouth";



export default class InletFace extends THREE.Group {
  constructor({ faceResource }) {
    super();
    Object.assign(this, {
      faceResource,
    });
    const facePartContour = new FacePartContour({ faceResource });
    this.add(facePartContour);

    const facePartLeftEye = new FacePartLeftEye({ faceResource });
    this.add(facePartLeftEye);

    const facePartRightEye = new FacePartRightEye({ faceResource });
    this.add(facePartRightEye);

    const facePartNose = new FacePartNose({ faceResource });
    this.add(facePartNose);

    const facePartMouth = new FacePartMouth({ faceResource });
    this.add(facePartMouth);


  }
}