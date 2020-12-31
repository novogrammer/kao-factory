import React from 'react'
import styles from './FactoryView.module.scss'

import CameraContext from "../context/CameraContext";

import FactoryApp from "../libs/FactoryApp";

export default class FactoryView extends React.Component{
  constructor(props){
    super(props);
    this.viewRef=React.createRef();
    this.dummyRef=React.createRef();
  }
  componentDidMount(){
    console.log("FactoryView#componentDidMount");
    console.log(this.dummyRef.current.innerHTML);
    const view=this.viewRef.current;
    this.factoryApp=new FactoryApp({view});
  }
  componentDidUpdate(){
    console.log("FactoryView#componentDidUpdate");
    console.log(this.dummyRef.current.innerHTML);
  }
  componentWillUnmount(){
    console.log("FactoryView#componentWillUnmount");
    this.factoryApp.destroyAsync();
  }

  render(){
    return (
      <CameraContext.Consumer>
        {
          ({position})=>{
            return (
              <div className={styles["container"]}>
                <canvas className={styles["view"]} ref={this.viewRef} playsInline />
                <div ref={this.dummyRef}>FactoryView:{JSON.stringify(position)}</div>

              </div>
      

            );
          }
        }
      </CameraContext.Consumer>
    );
  }
}