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
    this.state = {
      position: { x: 123, y: 234, z: 345 },
      updatePosition,
    };
  }
  render() {
    const { children } = this.props;
    const { position } = this.state;
    return (
      <CameraContext.Provider value={this.state}>

        <div>FactoryLayout:{JSON.stringify(position)}</div>
        <FactoryView position={position}></FactoryView>
        <main>{children}</main>
      </CameraContext.Provider>
    );
  }
}
