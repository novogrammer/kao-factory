import CameraContext from "../context/CameraContext";

//パラメーターを送るだけ。
export default function Factory(props){
  const {position}=props;
  return (
    <CameraContext.Consumer>
      {
        ({updatePosition})=>{
          updatePosition(position);
          return (<div>Factory:{JSON.stringify(position)}</div>);
        }
      }
    </CameraContext.Consumer>

  );
}