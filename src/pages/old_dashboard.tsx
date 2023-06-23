import NavSideBar from "y/components/layout";
import { StdSurveillance } from "y/components/map/useSurveillance";

export default function Dashboard() {
  return (
    <>
      <NavSideBar>
        <StdSurveillance />
      </NavSideBar>
    </>
  );
}
