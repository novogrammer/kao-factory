import React from 'react'
import CameraContext from "../context/CameraContext";

export default class FactoryView extends React.Component{
  constructor(props){
    super(props);
    this.dummyRef=React.createRef();
  }
  componentDidMount(){
    console.log("FactoryView#componentDidMount");
    console.log(this.dummyRef.current.innerHTML);
  }
  componentDidUpdate(){
    console.log("FactoryView#componentDidUpdate");
    console.log(this.dummyRef.current.innerHTML);
  }
  componentWillUnmount(){
    console.log("FactoryView#componentWillUnmount");
  }

  render(){
    return (
      <CameraContext.Consumer>
        {
          ({position})=>{
            return (<div ref={this.dummyRef}>FactoryView:{JSON.stringify(position)}</div>);
          }
        }
      </CameraContext.Consumer>
    );
  }
}