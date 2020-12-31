import React from 'react'
import CameraContext from "../context/CameraContext";

import FactoryView from "../components/FactoryView";
import Link from 'next/link'

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
        <Link href="/">
          <a>home</a>
        </Link>
        <Link href="/factory/">
          <a>FactoryOverView</a>
        </Link>
        <Link href="/factory/a/">
          <a>FactoryA</a>
        </Link>
        <Link href="/factory/b/">
          <a>FactoryB</a>
        </Link>
        <Link href="/factory/c/">
          <a>FactoryC</a>
        </Link>

        <div>FactoryLayout:{JSON.stringify(position)}</div>
        <FactoryView></FactoryView>
        <main>{children}</main>
      </CameraContext.Provider>
    );
  }
}
