import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryOverviewPage() {
  const position = { x: 0, y: 25, z: 10 };
  const lookat = { x: 0, y: 0, z: -5 };
  const fovy = 60;

  return (
    <Factory position={position} lookat={lookat} fovy={fovy}></Factory>
  );
}

FactoryOverviewPage.Layout = FactoryLayout;
export default FactoryOverviewPage;