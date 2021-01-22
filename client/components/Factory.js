import React from "react";
import CameraContext from "../context/CameraContext";

//パラメーターを送るだけ。
export default function Factory(props) {
  const { position, lookat, fovy } = props;
  const { updatePosition, updateLookat, updateFovy } = React.useContext(CameraContext);
  React.useEffect(() => {
    updatePosition(position);
    updateLookat(lookat);
    updateFovy(fovy);
  });
  return (<></>);
}