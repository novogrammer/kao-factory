import React from 'react'
import styles from './Entry.module.scss'

import CameraContext from "../context/CameraContext";

import EntryApp from "../libs/EntryApp";

export default class Entry extends React.Component{
  constructor(props){
    super(props);
    this.videoRef=React.createRef();
    this.viewRef=React.createRef();
  }
  componentDidMount(){
    console.log("Entry#componentDidMount");
    const video=this.videoRef.current;
    const view=this.viewRef.current;
    this.entryApp=new EntryApp({video,view});
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