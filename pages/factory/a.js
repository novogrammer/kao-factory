import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryAPage() {
  const position = { x: -3, y: 10, z: 10 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryAPage.Layout = FactoryLayout;
export default FactoryAPage;