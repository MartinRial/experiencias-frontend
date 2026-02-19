// src/components/Login.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { getLoginSchema } from "../schemas";
import { loginUserThunk } from "../redux/features/user/userThunk";
import { getExperienciasByUserThunk } from "../redux/features/experiences/experienceThunk";
import { resetExperiencias } from "../redux/features/experiences/experienceSlice";
import { toast } from "react-toastify";
import "../styles/Login.css";
import { useTranslation } from "react-i18next";

const initialValues = { email: "", password: "" };

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, error, loading } = useSelector((state) => state.userSlice);
  const { t, i18n } = useTranslation();

  const validationSchema = useMemo(() => getLoginSchema(t), [i18n.language]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Limpia experiencias anteriores por seguridad
        dispatch(resetExperiencias());

        const result = await dispatch(loginUserThunk(values));

        if (loginUserThunk.fulfilled.match(result)) {
          toast.success("Bienvenido a tus experiencias ✨");

          const userLogged = result.payload?.user;
          const tokenLogged = result.payload?.token;

          // 🔹 Aseguramos que se guarde en localStorage
          if (userLogged && tokenLogged) {
            localStorage.setItem("user", JSON.stringify(userLogged));
            localStorage.setItem("token", tokenLogged);

            // 🔹 Cargamos las experiencias SOLO cuando el user ya existe
            if (userLogged.role === "creator") {
              await dispatch(getExperienciasByUserThunk());
            }
          }

          // 🔹 Redirección controlada
          navigate("/dashboard", { replace: true });
          resetForm();
        } else {
          toast.error(result.payload || "Error al iniciar sesión");
        }
      } catch (err) {
        console.error("Error en login:", err);
        toast.error("Error inesperado al iniciar sesión");
      }
    },
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{t("login.title") || "Inicia sesión"}</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>{t("login.email") || "Email"}</label>
            <input
              type="email"
              name="email"
              placeholder={t("login.email_placeholder") || "Ingresá tu email"}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="username"
              required
            />
            {formik.errors.email && formik.touched.email && (
              <p className="error">{formik.errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>{t("login.password") || "Contraseña"}</label>
            <input
              type="password"
              name="password"
              placeholder={t("login.password_placeholder") || "Ingresá tu contraseña"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="current-password"
              required
            />
            {formik.errors.password && formik.touched.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </div>

          <button type="submit" className="btn-login" disabled={loading || !formik.isValid}>
            {loading
              ? t("login.loading") || "Ingresando..."
              : t("login.submit") || "Comenzar experiencia"}
          </button>

          <p className="register-link">
            {t("login.no_account") || "¿No tenés cuenta?"}{" "}
            <Link to="/register">{t("login.register_here") || "Registrate aquí"}</Link>
          </p>

          <div className="lang-switch">
            <button type="button" onClick={() => i18n.changeLanguage("es")}>ES</button>
            <button type="button" onClick={() => i18n.changeLanguage("en")}>EN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
