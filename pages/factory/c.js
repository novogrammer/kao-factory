import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryCPage() {
  const position = { x: 4, y: 2, z: 3 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryCPage.Layout = FactoryLayout;
export default FactoryCPage;