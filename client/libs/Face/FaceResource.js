import * as THREE from "three";
import {
  VIDEO_SIZE,
  FACE_HEIGHT,
  FACE_INDEX_NOSE_TIP,
  FACE_INDEX_FACE_TOP,
  FACE_INDEX_FACE_BOTTOM,
} from "../../../common/constants";
import {
  leftEyeFaces,
  rightEyeFaces,
  noseFaces,
  mouthFaces,
  allFaces,
} from "./face_parts_faces";

export default class FaceResource {
  constructor(face) {
    Object.assign(this, {
      face,
    });
    let geometries = this.makeGeometries();
    let materials = this.makeMaterials();

    Object.assign(this, {
      geometries,
      materials,
    });


  }

  makeGeometry(indices) {
    const { face } = this;
    const scaledKeypoints = face.prediction.scaledMesh;
    const geometry = new THREE.Geometry();
    for (let i = 0; i < scaledKeypoints.length; i++) {
      const scaledKeypoint = scaledKeypoints[i];
      geometry.vertices.push(new THREE.Vector3(
        scaledKeypoint[0],
        scaledKeypoint[1],
        scaledKeypoint[2]
      ));
    }
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i + 0];
      const b = indices[i + 1];
      const c = indices[i + 2];
      geometry.faces.push(
        new THREE.Face3(
          a,
          b,
          c
        )
      );
      const uvList = [a, b, c]
        .map(index => scaledKeypoints[index])
        .map(scaledKeyPoint => new THREE.Vector2(
          scaledKeyPoint[0],
          VIDEO_SIZE - scaledKeyPoint[1]
        ))
        .map(v => v.clone().multiplyScalar(1 / VIDEO_SIZE));

      geometry.faceVertexUvs[0].push(uvList);

    }
    {
      // geometry.translate(VIDEO_SIZE * -0.5, VIDEO_SIZE * -0.5, 0);
      //すでに右手座標系になっている。X軸180度回転
      const scaleForRotateX180 = new THREE.Vector3(1, -1, -1);
      geometry.scale(...scaleForRotateX180.toArray());
      const originalFaceTopPosition = new THREE.Vector3(...scaledKeypoints[FACE_INDEX_FACE_TOP]).multiply(scaleForRotateX180);
      const originalFaceBottomPosition = new THREE.Vector3(...scaledKeypoints[FACE_INDEX_FACE_BOTTOM]).multiply(scaleForRotateX180);
      const originalTopVector = originalFaceTopPosition.clone().sub(originalFaceBottomPosition);

      geometry.translate(...originalFaceBottomPosition.clone().multiplyScalar(-1).toArray());

      const l = originalTopVector.length();
      //高さを1に
      geometry.scale(1 / l, 1 / l, 1 / l);
      geometry.scale(FACE_HEIGHT, FACE_HEIGHT, FACE_HEIGHT);

      //傾いている顔を直す、この操作だけではY軸回転は治らない。
      const q = new THREE.Quaternion().setFromUnitVectors(originalTopVector.clone().normalize(), new THREE.Vector3(0, 1, 0));
      const mat = new THREE.Matrix4().makeRotationFromQuaternion(q);
      geometry.applyMatrix4(mat);


      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      geometry.uvsNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.verticesNeedUpdate = true;
    }



    return geometry;

  }
  makeGeometries() {
    const contour = this.makeGeometry(allFaces);
    const leftEye = this.makeGeometry(leftEyeFaces);
    const rightEye = this.makeGeometry(rightEyeFaces);
    const nose = this.makeGeometry(noseFaces);
    const mouth = this.makeGeometry(mouthFaces);

    return {
      contour,
      leftEye,
      rightEye,
      nose,
      mouth,
    };
  }
  makeMaterials() {
    const { face } = this;
    //TODO
    const normal = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(face.image),

    });
    const nopperi = new THREE.MeshBasicMaterial({
    });
    this.getNoseColorAsync().then((color) => {
      nopperi.color = color;
      nopperi.needsUpdate = true;
    });
    return {
      normal,
      nopperi,
    }
  }
  getNoseColorAsync() {
    return new Promise((resolve) => {
      const { face } = this;
      const { image } = face;
      const scaledKeypoints = face.prediction.scaledMesh;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = VIDEO_SIZE;
        canvas.height = VIDEO_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const [x, y] = scaledKeypoints[FACE_INDEX_NOSE_TIP];
        const pixel = ctx.getImageData(x, y, 1, 1);
        resolve(new THREE.Color(pixel.data[0] / 255, pixel.data[1] / 255, pixel.data[2] / 255));
      };
      img.src = image;

    });

  }
}

