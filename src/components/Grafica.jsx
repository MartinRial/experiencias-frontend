import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

//  REGISTRAR TODOS LOS COMPONENTES NECESARIOS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Grafica = ({ etiquetas, datos }) => {
  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: "Cantidad",
        data: datos,
        backgroundColor: [
          "rgba(102, 126, 234, 0.8)",
          "rgba(118, 75, 162, 0.8)",
          "rgba(237, 100, 166, 0.8)",
          "rgba(255, 154, 158, 0.8)",
          "rgba(250, 208, 196, 0.8)",
        ],
        borderColor: [
          "rgba(102, 126, 234, 1)",
          "rgba(118, 75, 162, 1)",
          "rgba(237, 100, 166, 1)",
          "rgba(255, 154, 158, 1)",
          "rgba(250, 208, 196, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ position: "relative", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Grafica;
