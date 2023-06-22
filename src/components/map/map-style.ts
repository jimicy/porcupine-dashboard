import { type Result } from "@mapbox/mapbox-gl-geocoder";
import type { FillLayer } from "react-map-gl";

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = function (selectedPlace: Result): FillLayer {
  const fillLayer: FillLayer = {
    id: "data",
    type: "fill",
    paint: {
      "fill-outline-color": "rgba(255,255,255,1)",
      "fill-opacity-transition": { duration: 500 }, // 500 milliseconds = 1/2 seconds
      "fill-color": {
        property: "caseRate",
        stops: [
          [0, "#ffffff"],
          [65, "#fbf9cf"],
          [108, "#a4d6b2"],
          [150, "#37b6c6"],
          [198, "#257fba"],
          [658, "#273892"],
        ],
      },
      "fill-opacity": 0.8,
    },
  };

  if (fillLayer.paint && selectedPlace) {
    fillLayer.paint["fill-opacity"] = [
      "case",
      ["boolean", ["==", ["get", "name"], selectedPlace.text], true],
      0.8,
      0.0,
    ];
  }

  return fillLayer;
};

export const casesDataLayer = function (selectedPlace: Result): FillLayer {
  const fillLayer: FillLayer = {
    id: "data",
    type: "fill",
    paint: {
      "fill-outline-color": "rgba(255,255,255,1)",
      "fill-opacity-transition": { duration: 500 }, // 500 milliseconds = 1/2 seconds
      "fill-color": {
        property: "cases",
        stops: [
          [0, "#ffffff"],
          [24, "#fbf9cf"],
          [66, "#a4d6b2"],
          [133, "#37b6c6"],
          [185, "#257fba"],
          [1155, "#273892"],
        ],
      },
      "fill-opacity": 0.8,
    },
  };

  if (fillLayer.paint && selectedPlace) {
    fillLayer.paint["fill-opacity"] = [
      "case",
      ["boolean", ["==", ["get", "name"], selectedPlace.text], true],
      0.8,
      0.0,
    ];
  }

  return fillLayer;
};
