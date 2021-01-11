import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryBPage() {
  const position = { x: 0, y: 10, z: 10 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryBPage.Layout = FactoryLayout;
export default FactoryBPage;