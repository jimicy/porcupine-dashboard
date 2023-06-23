import { Result } from "@mapbox/mapbox-gl-geocoder";
import { CircleLayer } from "mapbox-gl";

export const pointDataLayer = function (): CircleLayer {
  const fillLayer: CircleLayer = {
    id: "data",
    type: "circle",
    source: "drawCircle",
    paint: {
      // Make circles larger as the user zooms from z12 to z22.
      "circle-radius": {
        base: 1.75,
        stops: [
          [12, 2],
          [22, 180],
        ],
      },
      "circle-color": "#ED2939",
      "circle-stroke-color": "#333",
    },
  };

  return fillLayer;
};
