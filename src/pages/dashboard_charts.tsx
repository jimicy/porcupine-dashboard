import NavSideBar from "y/components/layout";
import { ClinicStdSurveillanceCharts } from "y/components/survey_charts/useClinicStdSurveillanceCharts";

export default function Dashboard() {
  return (
    <>
      <NavSideBar>
        <ClinicStdSurveillanceCharts />
      </NavSideBar>
    </>
  );
}
