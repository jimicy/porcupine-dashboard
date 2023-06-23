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
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
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
        text: `Survey breakdown by biological sex`,
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

  // Pie chart
  const pieData = {
    labels: [
      "Lesbian",
      "Heterosexual",
      "Gay",
      "Bisexual",
      "Pansexual",
      "Other",
    ],
    datasets: [
      {
        label: "Breakdown of sexual orientation",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const sentimentBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Porcupine Chat Patient Sentiment Analysis`,
      },
    },
  };

  const sentimentData = {
    labels,
    datasets: [
      {
        label: "sentiment score",
        data: [2, 5, 6, 6, 7],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      <Box
        style={{
          width: "100%",
          position: "absolute",
          display: "flex",
        }}
      >
        <Card
          style={{
            aspectRatio: "2/1",
            width: "20%",
          }}
        >
          <CardBody>
            <Pie data={pieData} />
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
              options={sentimentBarOptions}
              data={sentimentData}
              style={{ width: "100%", height: "100%" }}
            />
          </CardBody>
        </Card>
        <Card
          style={{
            aspectRatio: "2/1",
            width: "20%",
            padding: 15,
            marginLeft: 15,
          }}
        >
          <h1>Example of sentiment analysis:</h1>
          <p>
            "I was afraid and young. At the time, they were giving large doses
            of AZT [an anti-HIV drug also known as ZDV, or zidovudine]. It was
            my only option, and they wanted me to sign a waiver that said it
            could damage my internal organs. I was scared. I almost died because
            of the decision not to take meds."
          </p>
          <br />
          <p>
            GPT: Performing sentiment analysis on the given text from 1 to 10,
            where 1 is negative, 5 is neutral, and 10 is very positive, the
            sentiment score would be: 3. The text expresses negative emotions
            such as fear, being scared, and the mention of almost dying due to a
            decision. These elements contribute to a predominantly negative
            sentiment in the text, resulting in a sentiment score closer to the
            negative end of the scale.
          </p>
        </Card>
      </Box>

      <Box
        style={{
          width: "100%",
          position: "absolute",
          top: "40%",
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
