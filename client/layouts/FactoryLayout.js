import React from 'react'
import CameraContext from "../context/CameraContext";

import FactoryView from "../components/FactoryView";

export default class FactoryLayout extends React.Component {
  constructor(props) {
    super(props);
    const updatePosition = (position) => {
      const isSame = ["x", "y", "z"].map((key) => this.state.position[key] == position[key]).every(e => e);
      if (!isSame) {
        this.setState({ position });
      }
    };
    const updateLookat = (lookat) => {
      const isSame = ["x", "y", "z"].map((key) => this.state.lookat[key] == lookat[key]).every(e => e);
      if (!isSame) {
        this.setState({ lookat });
      }
    };
    const updateFovy = (fovy) => {
      if (this.state.fovy != fovy) {
        this.setState({ fovy });
      }
    };
    const updateFacescale = (facescale) => {
      if (this.state.facescale != facescale) {
        this.setState({ facescale });
      }
    };

    this.state = {
      position: { x: 0, y: 0, z: 0 },
      updatePosition,
      lookat: { x: 0, y: 0, z: 5 },
      updateLookat,
      fovy: 60,
      updateFovy,
      facescale: 1,
      updateFacescale,
    };
  }
  render() {
    const { children } = this.props;
    const { position, lookat, fovy, facescale } = this.state;
    return (
      <CameraContext.Provider value={this.state}>
        <FactoryView position={position} lookat={lookat} fovy={fovy} facescale={facescale}></FactoryView>
        <main>{children}</main>
      </CameraContext.Provider>
    );
  }
}
