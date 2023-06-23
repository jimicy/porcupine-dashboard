import { useEffect, useState } from "react";
import { Box, Card, CardBody } from "@chakra-ui/react";
import { type Result } from "@mapbox/mapbox-gl-geocoder";

import { supabase } from "y/utils/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import PointMap from "./map";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
);

type StdCase = {
  disease: string;
  state: string;
  cases_2017: number;
  cases_2018: number;
  cases_2019: number;
  cases_2020: number;
  cases_2021: number;
  rate_2017: number;
  rate_2018: number;
  rate_2019: number;
  rate_2020: number;
  rate_2021: number;
  id: string;
};

type StdCaseLookup = {
  [state: string]: {
    [disease: string]: {
      [year: string]: {
        cases: number;
        rate: number;
        bySex: {
          men: {
            cases: number;
            rate: number;
          };
          women: {
            cases: number;
            rate: number;
          };
        };
      };
    };
  };
};

export type Disease = "chlamydia" | "gonorrhea" | "syphilis";
export type Sex = "women" | "men" | "";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useClinicStdSurveillanceMaps() {
  const [stdData, setStdData] = useState<StdCaseLookup | null>(null);
  const [geoData, setGeoData] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);

  // Control panel states
  const [selectedPlace, setSelectedPlace] = useState<Result | null>(null);
  const [year, setYear] = useState(2018);
  const [disease, setDisease] = useState<Disease>("chlamydia");
  const [sex, setSex] = useState<Sex>("");

  useEffect(() => {
    if (geoData === null || stdData == null || stdData === null) {
      return;
    }

    function updateCases(
      featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>
    ): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
      const { features } = featureCollection;
      return {
        type: "FeatureCollection",
        features: features.map((f) => {
          const properties = {
            ...f.properties,
            drawCircle: true,
          };

          return { ...f, properties };
        }),
      };
    }

    const newGeoData = updateCases(geoData);

    setGeoData(newGeoData);
  }, [year]);

  useEffect(() => {
    async function fetchResources() {
      await fetch(
        "https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson"
      )
        .then((resp) => resp.json())
        .then((json: GeoJSON.FeatureCollection<GeoJSON.Geometry>) =>
          setGeoData(json)
        )
        .catch((err) => console.error("Could not load data", err));

      setYear(2021);
    }
    void fetchResources();
  }, []);

  return {
    year,
    setYear,
    disease,
    setDisease,
    sex,
    setSex,
    geoData,
    setGeoData,
    selectedPlace,
    setSelectedPlace,
  };
}

export function ClinicStdSurveillanceMaps() {
  const {
    year,
    setYear,
    disease,
    setDisease,
    sex,
    setSex,
    geoData,
    selectedPlace,
    setSelectedPlace,
  } = useClinicStdSurveillanceMaps();

  return (
    <>
      <PointMap
        year={year}
        setYear={setYear}
        disease={disease}
        setDisease={setDisease}
        sex={sex}
        setSex={setSex}
        geoData={geoData}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
      />
    </>
  );
}
