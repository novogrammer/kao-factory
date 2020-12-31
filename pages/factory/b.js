import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryBPage() {
  const position = { x: 3, y: 2, z: 3 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryBPage.Layout = FactoryLayout;
export default FactoryBPage;