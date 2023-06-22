/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as React from "react";
import { useState, useCallback } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  MapRef,
} from "react-map-gl";
import ControlPanel, { Mode } from "./real-time-control-panel";

import { dataLayer } from "./map-style";
import GeocoderControl from "./geocoder-control";
import { type Result } from "@mapbox/mapbox-gl-geocoder";
import { Disease, Sex } from "./useSurveillance";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamltaWN5IiwiYSI6ImNsaXdybHI5YTAwb3Ezam4ybTZzbm0wbzQifQ.AAR6g39MzvGmbCSFOJ5noA"; // Set your mapbox token here

const LeftMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
};

const RightMapStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
};

export default function ChoroplethMap(props: {
  year: number;
  setYear: (year: number) => void;
  disease: Disease;
  setDisease: (disease: string) => void;
  sex: Sex;
  setSex: (sex: string) => void;
  geoData: GeoJSON.FeatureCollection<GeoJSON.Geometry> | null;
  selectedPlace: Result | null;
  setSelectedPlace: (place: Result | null) => void;
}) {
  const mapRef = React.useRef<MapRef>(null);

  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const [viewState, setViewState] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3,
    bounds: [
      [-133.2421875, 16.972741],
      [-47.63671875, 52.696361],
    ],
  });

  const [mode, setMode] = useState<Mode>("side-by-side");
  // Two maps could be firing 'move' events at the same time, if the user interacts with one
  // while the other is in transition.
  // This state specifies which map to use as the source of truth
  // It is set to the map that received user input last ('movestart')
  const [activeMap, setActiveMap] = useState<"left" | "right">("left");

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt) => setViewState(evt.viewState), []);

  const width = typeof window === "undefined" ? 100 : window.innerWidth;

  const leftMapPadding = React.useMemo(() => {
    return {
      left: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }, [width, mode]);

  const rightMapPadding = React.useMemo(() => {
    return {
      right: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0,
    };
  }, [width, mode]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "90%",
          height: "50%",
        }}
      >
        <Map
          ref={mapRef}
          reuseMaps
          {...viewState}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={["data"]}
          onMouseMove={onHover}
          padding={leftMapPadding}
          onMoveStart={onLeftMoveStart}
          onMove={(evt) => {
            activeMap === "left" && onMove(evt);
          }}
          style={LeftMapStyle}
        >
          <GeocoderControl
            mapboxAccessToken={MAPBOX_TOKEN}
            position="top-left"
            marker={false}
            onResult={(event: any) => {
              props.setSelectedPlace(event.result);
            }}
            onClear={() => {
              mapRef.current?.fitBounds([
                [-133.2421875, 16.972741],
                [-47.63671875, 52.696361],
              ]);
              props.setSelectedPlace(null);
            }}
          />
          <ScaleControl />

          <Source type="geojson" data={props.geoData}>
            <Layer {...dataLayer(props.selectedPlace)} />
          </Source>

          {hoverInfo && (
            <div
              className="tooltip"
              style={{ left: hoverInfo.x, top: hoverInfo.y }}
            >
              <div>State: {hoverInfo.feature.properties.name}</div>
              <div>Total cases: {hoverInfo.feature.properties.cases}</div>
              <div>Case Rate: {hoverInfo.feature.properties.caseRate}</div>
            </div>
          )}
        </Map>
        <Map
          id="right-map"
          reuseMaps
          {...viewState}
          padding={rightMapPadding}
          onMoveStart={onRightMoveStart}
          onMove={(evt) => {
            activeMap === "right" && onMove(evt);
          }}
          style={RightMapStyle}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        />
        <ControlPanel
          year={props.year}
          disease={props.disease}
          setDisease={props.setDisease}
          sex={props.sex}
          setSex={props.setSex}
          selectedPlace={props.selectedPlace}
          setYear={props.setYear}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </>
  );
}
