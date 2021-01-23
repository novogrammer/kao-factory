import React from 'react'
import styles from './FactoryView.module.scss'

import LogTextContext from "../context/LogTextContext";

import FactoryClientApp from "../libs/Factory/FactoryClientApp";

export default class FactoryView extends React.Component {
  static contextType = LogTextContext;
  constructor(props) {
    super(props);
    this.viewRef = React.createRef();
  }
  async componentDidMount() {
    console.log("FactoryView#componentDidMount");
    const view = this.viewRef.current;
    const { addLogText, clearLogText } = this.context;

    const { position, lookat, fovy, facescale } = this.props;

    this.factoryApp = new FactoryClientApp({
      view,
      addLogText,
      clearLogText,
      position,
      lookat,
      fovy,
      facescale,
    });
    await this.factoryApp.setupPromise;
  }
  componentDidUpdate() {
    console.log("FactoryView#componentDidUpdate");
    const { position, lookat, fovy, facescale } = this.props;
    this.factoryApp.updatePosition(position);
    this.factoryApp.updateLookat(lookat);
    this.factoryApp.updateFovy(fovy);
    this.factoryApp.updateFacescale(facescale);
  }
  componentWillUnmount() {
    console.log("FactoryView#componentWillUnmount");
    this.factoryApp.destroyAsync();
  }

  render() {
    const { position } = this.props;
    return (
      <div className={styles["container"]}>
        <canvas className={styles["view"]} ref={this.viewRef} playsInline />
      </div>
    );
  }
}