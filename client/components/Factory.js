import React from "react";
import CameraContext from "../context/CameraContext";

//パラメーターを送るだけ。
export default function Factory(props) {
  const { position, lookat, fovy, facescale } = props;
  const { updatePosition, updateLookat, updateFovy, updateFacescale } = React.useContext(CameraContext);
  React.useEffect(() => {
    updatePosition(position);
    updateLookat(lookat);
    updateFovy(fovy);
    updateFacescale(facescale);
  });
  return (<></>);
}