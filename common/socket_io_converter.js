//対応する関数は THREE.Vector3#copy()
export function fromVector3ToObject(v) {
  return {
    x: v.x,
    y: v.y,
    z: v.z,
  };
}
//対応する関数は THREE.Quaternion#copy()
export function fromQuaternionToObject(q) {
  return {
    x: q.x,
    y: q.y,
    z: q.z,
    w: q.w,
  };
}