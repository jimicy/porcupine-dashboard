import { useEffect, useState } from "react";
import { Box, Card, CardBody } from "@chakra-ui/react";
import { type Result } from "@mapbox/mapbox-gl-geocoder";

import { supabase } from "y/utils/api";
import ChoroplethMap from "y/components/map/dual_map";
import { faker } from "@faker-js/faker";

faker.seed(123);

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

export function ClinicStdSurveillanceCharts() {
  const labels = [
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
  ];

  // Charts data
  // Days between appointment and getting test results
  const avgTestDaysDataLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Avg Days between appointment and getting test results`,
      },
    },
  };
  const avgTestDaysData = {
    labels,
    datasets: [
      {
        label: "Chlamydia",
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        data: labels.map(() => faker.datatype.number({ min: 1, max: 20 })),
      },
      {
        label: "Syphilis",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: labels.map(() => faker.datatype.number({ min: 1, max: 20 })),
      },
      {
        label: "Gnorrhea",
        borderColor: "rgb(0, 0, 102)",
        backgroundColor: "rgba(0, 0, 102, 0.5)",
        data: labels.map(() => faker.datatype.number({ min: 1, max: 20 })),
      },
    ],
  };

  // Do you use condoms with casual partners?

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `bar chart`,
      },
    },
  };

  const dataset = [];
  // Line 1
  dataset.push({
    label: "Men",
    data: [200, 100, 900, 500, 600],
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  });

  dataset.push({
    label: "Women",
    data: [700, 800, 900, 1000, 2000],
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  });

  dataset.push({
    label: "Total",
    data: [900, 900, 1800, 1500, 2600],
    borderColor: "rgb(0, 0, 102)",
    backgroundColor: "rgba(0, 0, 102, 0.5)",
  });

  const data = {
    labels,
    datasets: dataset,
  };

  return (
    <>
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
              options={avgTestDaysDataLineOptions}
              data={avgTestDaysData}
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
