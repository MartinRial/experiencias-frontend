import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upgradePlanThunk } from "../redux/features/user/userThunk";
import { toast } from "react-toastify";
import "../styles/UpgradePlan.css";

const UpgradePlan = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { list } = useSelector((state) => state.experienciasSlice);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const isPremium = user.plan === "premium";
  const currentLimit = isPremium ? 10 : 5;
  const currentCount = list?.length || 0;
  const percentage = Math.min((currentCount / currentLimit) * 100, 100);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await dispatch(upgradePlanThunk()).unwrap();
      toast.success("🎉 ¡Plan actualizado a Premium exitosamente!");
    } catch (error) {
      toast.error(`❌ Error al cambiar de plan: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upgrade-plan-container">
      {/* HEADER */}
      <div className="plan-header">
        <h3 className="plan-title">
          {isPremium ? "⭐ Plan Premium" : "💼 Cambio de Plan"}
        </h3>
        <span className={`plan-badge ${isPremium ? "premium" : "free"}`}>
          {isPremium ? "PREMIUM" : "FREE"}
        </span>
      </div>

      {/* CONTENIDO */}
      {isPremium ? (
        <div className="premium-message">
          <div className="premium-icon">🎉</div>
          <p className="premium-text">
            ¡Disfrutás de tu plan <strong>Premium</strong> sin límites!
          </p>
          <div className="premium-features">
            <div className="feature">✅ Experiencias ilimitadas</div>
            <div className="feature">✅ Soporte prioritario</div>
            <div className="feature">✅ Estadísticas avanzadas</div>
          </div>
        </div>
      ) : (
        <>
          {/* PROGRESO */}
          <div className="plan-progress">
            <div className="progress-header">
              <span className="progress-label">Experiencias usadas</span>
              <span className="progress-count">
                {currentCount} / {currentLimit}
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: percentage >= 80 ? '#f56565' : '#667eea'
                }}
              />
            </div>
            {percentage >= 80 && (
              <p className="progress-warning">
                ⚠️ Estás cerca del límite. ¡Actualiza a Premium!
              </p>
            )}
          </div>

          {/* COMPARACIÓN DE PLANES */}
          <div className="plans-comparison">
            <div className="comparison-row">
              <span className="comparison-label">📝 Experiencias</span>
              <div className="comparison-values">
                <span className="current-value">5</span>
                <span className="arrow">→</span>
                <span className="premium-value">10</span>
              </div>
            </div>
            <div className="comparison-row">
              <span className="comparison-label">📊 Estadísticas</span>
              <div className="comparison-values">
                <span className="current-value">Básicas</span>
                <span className="arrow">→</span>
                <span className="premium-value">Avanzadas</span>
              </div>
            </div>
            <div className="comparison-row">
              <span className="comparison-label">🎯 Soporte</span>
              <div className="comparison-values">
                <span className="current-value">Estándar</span>
                <span className="arrow">→</span>
                <span className="premium-value">Prioritario</span>
              </div>
            </div>
          </div>

          {/* BOTÓN DE UPGRADE */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-upgrade"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Actualizando...
              </>
            ) : (
              <>
                ⭐ Cambiar a Premium
              </>
            )}
          </button>

          <p className="upgrade-note">
            💡 El cambio es instantáneo y sin cargo adicional
          </p>
        </>
      )}
    </div>
  );
};

export default UpgradePlan;