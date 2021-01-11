import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryCPage() {
  const position = { x: 3, y: 10, z: 10 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryCPage.Layout = FactoryLayout;
export default FactoryCPage;