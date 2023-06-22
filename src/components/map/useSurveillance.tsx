import { useEffect, useState } from "react";
import { Box, Card, CardBody } from "@chakra-ui/react";
import { type Result } from "@mapbox/mapbox-gl-geocoder";

import { supabase } from "y/utils/api";
import ChoroplethMap from "y/components/map/dual_map";

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

export function useStdSurveillance() {
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
      data: StdCaseLookup,
      featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>
    ): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
      const { features } = featureCollection;
      return {
        type: "FeatureCollection",
        features: features.map((f) => {
          const caseData = data[f.properties.name][disease][year];
          if (!caseData) {
            return f;
          }

          let cases: number;
          let rate: number;
          if (sex !== "" && caseData.bySex[sex]) {
            ({ cases, rate } = caseData.bySex[sex]);
          } else {
            ({ cases, rate } = caseData);
          }

          const properties = {
            ...f.properties,
            cases: cases,
            caseRate: rate,
          };

          return { ...f, properties };
        }),
      };
    }

    const newGeoData = updateCases(stdData, geoData);

    setGeoData(newGeoData);
  }, [year, disease, sex]);

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

      await supabase
        .from("2017_2021_std_surveillance")
        .select()
        .then((resp) => {
          const data: StdCase[] = resp.data as StdCase[];

          const lookup: StdCaseLookup = {};
          for (const row of data) {
            if (lookup[row.state] === undefined) {
              lookup[row.state] = {};
            }

            if (lookup[row.state][row.disease] === undefined) {
              lookup[row.state][row.disease] = {};
            }

            for (const year of [2017, 2018, 2019, 2020, 2021]) {
              lookup[row.state][row.disease][year] = {
                cases: row[`cases_${year}`],
                rate: row[`rate_${year}`],
                bySex: {
                  men: {
                    cases: row[`cases_${year}`],
                    rate: row[`rate_${year}`],
                  },
                  women: {
                    cases: row[`cases_${year}`],
                    rate: row[`rate_${year}`],
                  },
                },
              };
            }
          }
          setStdData(lookup);
        });

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

export function StdSurveillance() {
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
  } = useStdSurveillance();

  // Charts data
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `(${disease}) STD Case Rate*, ${
          selectedPlace?.text ?? "United States"
        }`,
      },
      subtitle: {
        display: true,
        text: "*per 100,000 people",
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `(${disease}) STD Cases, ${
          selectedPlace?.text ?? "United States"
        }`,
      },
    },
  };

  const labels = ["2017", "2018", "2019", "2020", "2021"];

  const dataset = [];
  if (sex === "men" || sex === "") {
    dataset.push({
      label: "Men",
      data: [200, 100, 900, 500, 600],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    });
  }

  if (sex === "women" || sex === "") {
    dataset.push({
      label: "Women",
      data: [700, 800, 900, 1000, 2000],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    });
  }

  if (sex === "") {
    dataset.push({
      label: "Total",
      data: [900, 900, 1800, 1500, 2600],
      borderColor: "rgb(0, 0, 102)",
      backgroundColor: "rgba(0, 0, 102, 0.5)",
    });
  }

  const data = {
    labels,
    datasets: dataset,
  };

  return (
    <>
      <ChoroplethMap
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
      <Box
        style={{
          width: "100%",
          position: "absolute",
          top: "51%",
          display: "flex",
        }}
      >
        <Card
          style={{
            aspectRatio: "2/1",
            width: "40%",
          }}
        >
          <CardBody>
            <Line
              options={lineOptions}
              data={data}
              style={{ width: "100%", height: "100%" }}
            />
          </CardBody>
        </Card>
        <Card
          style={{
            aspectRatio: "2/1",
            width: "40%",
            marginLeft: 15,
          }}
        >
          <CardBody>
            <Bar
              options={barOptions}
              data={data}
              style={{ width: "100%", height: "100%" }}
            />
          </CardBody>
        </Card>
      </Box>
    </>
  );
}
