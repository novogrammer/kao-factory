import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryOverviewPage() {
  const position = { x: 0, y: 15, z: 15 };

  return (
    <Factory position={position}></Factory>
  );
}

FactoryOverviewPage.Layout = FactoryLayout;
export default FactoryOverviewPage;