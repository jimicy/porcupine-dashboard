import NavSideBar from "y/components/layout";
import { ClinicStdSurveillanceMaps } from "y/components/survey_maps/useClinicStdSurveillanceMaps";

export default function Dashboard() {
  return (
    <>
      <NavSideBar>
        <ClinicStdSurveillanceMaps />
      </NavSideBar>
    </>
  );
}
