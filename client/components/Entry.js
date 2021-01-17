import React from 'react'
import styles from './Entry.module.scss'

import LogTextContext from "../context/LogTextContext";

import EntryClientApp from "../libs/Entry/EntryClientApp";

export default class Entry extends React.Component {
  static contextType = LogTextContext;
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.viewRef = React.createRef();
    this.loadingRef = React.createRef();
  }
  async componentDidMount() {
    console.log("Entry#componentDidMount");
    const video = this.videoRef.current;
    const view = this.viewRef.current;
    const loading = this.loadingRef.current;
    const { addLogText, clearLogText } = this.context;
    this.entryApp = new EntryClientApp({
      video,
      view,
      loading,
      addLogText,
      clearLogText,
    });
    await this.entryApp.setupPromise;
  }
  componentDidUpdate() {
    console.log("Entry#componentDidUpdate");
  }
  componentWillUnmount() {
    console.log("Entry#componentWillUnmount");
    this.entryApp.destroyAsync();
  }

  render() {
    return (
      <div className={styles["container"]}>
        <video className={styles["video"]} ref={this.videoRef} playsInline />
        <canvas className={styles["view"]} ref={this.viewRef} playsInline />
        <div className={styles["loading"]} ref={this.loadingRef}>LOADING...</div>
      </div>
    );
  }
}