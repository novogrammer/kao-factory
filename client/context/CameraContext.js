import React from 'react'


const CameraContext = React.createContext({
  position: {x:0,y:0,z:0},
  updatePosition:()=>{},
});
export default CameraContext;