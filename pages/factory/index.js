import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryOverviewPage() {
  const position = { x: 1, y: 2, z: 3 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryOverviewPage.Layout = FactoryLayout;
export default FactoryOverviewPage;