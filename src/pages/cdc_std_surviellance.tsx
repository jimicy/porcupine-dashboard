import NavSideBar from "y/components/layout";
import { OldStdSurveillance } from "y/components/map/useOldStdSurveillance";

export default function Dashboard() {
  return (
    <>
      <NavSideBar>
        <OldStdSurveillance />
      </NavSideBar>
    </>
  );
}
