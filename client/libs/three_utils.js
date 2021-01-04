import * as THREE from "three";

export function makeArrow(from, to, color = 0xffff00) {
  const v = to.clone().sub(from);
  const length = v.length();
  const arrow = new THREE.ArrowHelper(
    v.clone().normalize(),
    from,
    length,
    color,
    0.2,
    0.2
  );
  return arrow;

}
export function makeLine(curve, color = 0xffff00, divisions = 32) {
  const points = [];
  for (let i = 0; i <= divisions; ++i) {
    const point = curve.getPoint(i / divisions);
    points.push(point);
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);;
  const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const line = new THREE.Line(geometry, material);
  return line;

}

export function makeCube(l = 1, color = 0x00ff00) {
  let geometry = new THREE.BoxGeometry(l, l, l);
  let material = new THREE.MeshStandardMaterial({
    color
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;

}
