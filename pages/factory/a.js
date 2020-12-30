import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryAPage(){
  const position={x:2,y:2,z:3};
  
  return (
    <Factory position={position}></Factory>
  );
}

FactoryAPage.Layout=FactoryLayout;
export default FactoryAPage;