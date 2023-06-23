/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  MapRef,
} from "react-map-gl";

import { pointDataLayer } from "./map-style";
import { type Result } from "@mapbox/mapbox-gl-geocoder";
import GeocoderControl from "../map/geocoder-control";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamltaWN5IiwiYSI6ImNsaXdybHI5YTAwb3Ezam4ybTZzbm0wbzQifQ.AAR6g39MzvGmbCSFOJ5noA"; // Set your mapbox token here

export default function PointMap(props: {
  year: number;
  setYear: (year: number) => void;
  disease: string;
  setDisease: (disease: string) => void;
  sex: string;
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

  return (
    <>
      <Map
        ref={mapRef}
        reuseMaps
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3,
          bounds: [
            [-133.2421875, 16.972741],
            [-47.63671875, 52.696361],
          ],
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["data"]}
        onMouseMove={onHover}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
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
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        <Source type="geojson" data={props.geoData}>
          <Layer {...pointDataLayer()} />
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
    </>
  );
}
