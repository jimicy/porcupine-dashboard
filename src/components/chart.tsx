//Libraries
import dynamic from "next/dynamic";
import { useState } from "react";

const Plot = dynamic(
  () => {
    return import("react-plotly.js");
  },
  { ssr: false }
);

export default function Chart() {
  const [data, setData] = useState([
    {
      type: "choroplethmapbox",
      locations: ["NY", "MA", "VT"],
      z: [-50, -10, -20],
      geojson:
        "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json",
    },
  ]);

  const layout = {
    mapbox: { center: { lon: -74, lat: 43 }, zoom: 3.5 },
  };

  const config = {
    mapboxAccessToken:
      "pk.eyJ1IjoiamltaWN5IiwiYSI6ImNsaXdybHI5YTAwb3Ezam4ybTZzbm0wbzQifQ.AAR6g39MzvGmbCSFOJ5noA",
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}
