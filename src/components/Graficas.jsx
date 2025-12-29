import React, { useEffect, useState } from "react";
import Grafica from "./Grafica";
import { useSelector } from "react-redux";

const Graficas = () => {
  const experiences = useSelector((state) => state.experiences.list);

  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const grouped = experiences.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + 1;
      return acc;
    }, {});

    setLabels(Object.keys(grouped));
    setValues(Object.values(grouped));
  }, [experiences]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Experiencias por categoría</h3>
      <Grafica etiquetas={labels} datos={values} />
    </div>
  );
};

export default Graficas;
