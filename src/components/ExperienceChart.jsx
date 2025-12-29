// src/components/ExperienceChart.jsx
import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ExperienceChart = () => {
const experiences = useSelector((state) => state.experienciasSlice.list);

  // Agrupar experiencias por categoría
  const data = experiences.reduce((acc, exp) => {
    const existing = acc.find((d) => d.category === exp.category);
    if (existing) existing.count++;
    else acc.push({ category: exp.category, count: 1 });
    return acc;
  }, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Experiencias por categoría</h3>
      {data.length === 0 ? (
        <p className="text-gray-500">Aún no hay experiencias para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExperienceChart;
