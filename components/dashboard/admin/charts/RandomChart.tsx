"use client";

import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import React from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// Generate random data
const generateData = () => {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May"];
  const values = labels.map(() => Math.floor(Math.random() * 100));
  return { labels, values };
};

const getRandomChart = () => {
  const { labels, values } = generateData();
  const datasets = [{ label: "Data", data: values, backgroundColor: "#6366f1" }];
  
  const type = ["bar", "pie", "line"][Math.floor(Math.random() * 3)];

  switch (type) {
    case "bar":
      return <Bar data={{ labels, datasets }} options={{ responsive: true }} />;
    case "pie":
      return <Pie data={{ labels, datasets }} options={{ responsive: true }} />;
    case "line":
      return <Line data={{ labels, datasets }} options={{ responsive: true }} />;
    default:
      return null;
  }
};

export default function RandomChart() {
  return (
    <div className="w-full h-full p-4">
      {getRandomChart()}
    </div>
  );
}