import React from "react";
import { useSelector } from "react-redux";
import "../styles/UsageReport.css";

const UsageReport = () => {
  const user = useSelector((state) => state.userSlice.user);
  const experiences = useSelector((state) => state.experienciasSlice.list);

  if (!user || user.role !== "creator") return null;

  const plan = user.plan;
  const totalExperiencias = experiences.length;
  const maxPlus = 10;
  const porcentajeUso = plan === "plus"
    ? Math.min((totalExperiencias / maxPlus) * 100, 100)
    : null;

  return (
    <div className="usage-report-card">
      <h3 className="usage-title">📊 Informe de uso</h3>

      {plan === "plus" ? (
        <div className="usage-content">
          <p className="usage-info">
            Plan actual: <strong className="plan-plus">Plus 🌟</strong>
          </p>
          <p className="usage-info">
            Experiencias creadas: <strong>{totalExperiencias}</strong> / {maxPlus}
          </p>
          
          {/* Barra de progreso */}
          <div className="progress-bar-container">
            <div
              className={`progress-bar ${totalExperiencias >= maxPlus ? 'full' : ''}`}
              style={{ width: `${porcentajeUso}%` }}
            >
              <span className="progress-text">{porcentajeUso.toFixed(1)}%</span>
            </div>
          </div>
          
          <p className="usage-percentage">
            {porcentajeUso.toFixed(1)}% del límite utilizado
          </p>

          {totalExperiencias >= maxPlus && (
            <div className="usage-alert">
              ⚠️ Has alcanzado el límite. <strong>Actualiza a Premium</strong> para experiencias ilimitadas.
            </div>
          )}
        </div>
      ) : (
        <div className="usage-content">
          <p className="usage-info">
            Plan actual: <strong className="plan-premium">Premium 💎</strong>
          </p>
          <p className="usage-info">
            Total de experiencias creadas: <strong>{totalExperiencias}</strong>
          </p>
          <p className="usage-unlimited">✨ Experiencias ilimitadas</p>
        </div>
      )}
    </div>
  );
};

export default UsageReport;