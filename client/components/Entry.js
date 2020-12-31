import React from 'react'
import styles from './Entry.module.scss'

import CameraContext from "../context/CameraContext";

import EntryClientApp from "../libs/EntryClientApp";

export default class Entry extends React.Component{
  constructor(props){
    super(props);
    this.videoRef=React.createRef();
    this.viewRef=React.createRef();
  }
  async componentDidMount(){
    console.log("Entry#componentDidMount");
    const video=this.videoRef.current;
    const view=this.viewRef.current;
    this.entryApp=new EntryClientApp({video,view});
    await this.entryApp.setupPromise;
  }
  componentDidUpdate(){
    console.log("Entry#componentDidUpdate");
  }
  componentWillUnmount(){
    console.log("Entry#componentWillUnmount");
    this.entryApp.destroyAsync();
  }

  render(){
    return (
      <div className={styles["container"]}>
        <video className={styles["video"]} ref={this.videoRef} playsInline />
        <canvas className={styles["view"]} ref={this.viewRef} playsInline />
      </div>
    );
  }
}