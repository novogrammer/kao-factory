import Factory from "../../client/components/Factory";
import FactoryLayout from "../../client/layouts/FactoryLayout";


function FactoryAPage() {
  const position = { x: -10, y: 5, z: 17 };
  const lookat = { x: -10, y: 4, z: 0 };
  const fovy = 60;

  return (
    <Factory position={position} lookat={lookat} fovy={fovy}></Factory>
  );
}

FactoryAPage.Layout = FactoryLayout;
export default FactoryAPage;