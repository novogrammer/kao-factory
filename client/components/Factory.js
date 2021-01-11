import React from "react";
import CameraContext from "../context/CameraContext";

//パラメーターを送るだけ。
export default function Factory(props) {
  const { position } = props;
  const { updatePosition } = React.useContext(CameraContext);
  React.useEffect(() => {
    updatePosition(position);
  });
  return (<></>);
}