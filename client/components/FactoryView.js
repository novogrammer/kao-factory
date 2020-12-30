import React from 'react'
import CameraContext from "../context/CameraContext";

export default class FactoryView extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log("FactoryView#componentDidMount");
  }
  componentDidUpdate(){
    console.log("FactoryView#componentDidUpdate");
  }
  componentWillUnmount(){
    console.log("FactoryView#componentWillUnmount");
  }

  render(){
    return (
      <CameraContext.Consumer>
        {
          ({position})=>{
            return (<div>FactoryView:{JSON.stringify(position)}</div>);
          }
        }
      </CameraContext.Consumer>
    );
  }
}