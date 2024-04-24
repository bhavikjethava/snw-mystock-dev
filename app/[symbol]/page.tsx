"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React, { useEffect } from "react";
import { stockDetail } from "../../utils/stockList";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const labels = stockDetail?.data?.map((x) => x.date.split('T')[0]);
const data = {
  labels,
  datasets: [
    {
      label: "",
      fill: true,
      data: stockDetail?.data?.map((x) => x.close),
      borderColor: "rgb(255, 255, 255)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const StockDetail = () => {
  const symbol = "APLE"; // Example stock symbol
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "APLE",
      },
    },
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};

export default StockDetail;
