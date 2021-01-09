import React from 'react'
import styles from './FactoryView.module.scss'

import LogTextContext from "../context/LogTextContext";

import FactoryClientApp from "../libs/FactoryClientApp";

export default class FactoryView extends React.Component {
  static contextType = LogTextContext;
  constructor(props) {
    super(props);
    this.viewRef = React.createRef();
    this.dummyRef = React.createRef();
  }
  async componentDidMount() {
    console.log("FactoryView#componentDidMount");
    console.log(this.dummyRef.current.innerHTML);
    const view = this.viewRef.current;
    const { addLogText, clearLogText } = this.context;

    this.factoryApp = new FactoryClientApp({
      view,
      addLogText,
      clearLogText,
    });
    await this.factoryApp.setupPromise;
  }
  componentDidUpdate() {
    console.log("FactoryView#componentDidUpdate");
    console.log(this.dummyRef.current.innerHTML);
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
        <div ref={this.dummyRef}>FactoryView:{JSON.stringify(position)}</div>
      </div>
    );
  }
}