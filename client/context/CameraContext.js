import React from 'react'


const CameraContext = React.createContext({
  position: { x: 0, y: 0, z: 5 },
  updatePosition: () => { },
  lookat: { x: 0, y: 0, z: 0 },
  updateLookat: () => { },
  fovy: 60,
  updateFovy: () => { },

});
export default CameraContext;