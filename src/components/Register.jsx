// src/components/Register.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { registerSchema } from "../schemas"; // vamos a ajustar esto abajo
import { registerUserThunk } from "../redux/features/user/userThunk";
import { toast } from "react-toastify";
import "../styles/Login.css";
import { useTranslation } from "react-i18next";

const initialValues = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
  role: "user", // default visual, podés arrancar como "user" o "creator"
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, error, loading } = useSelector((state) => state.userSlice);

  const { t, i18n } = useTranslation();

  // schema dinámico (traduce errores según idioma)
  const validationSchema = useMemo(() => registerSchema(t), [i18n.language]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // armamos el body para backend: no mandamos repeatPassword
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      dispatch(registerUserThunk(payload));
    },
  });

  // si ya tengo token -> autologin exitoso -> voy al dashboard
  useEffect(() => {
    if (token) {
      toast.success(t("register.success") || "Registro exitoso. Bienvenido 👋");
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate, t]);

  // si hay error del backend -> mostrarlo
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{t("register.title") || "Crear cuenta"}</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label>{t("register.name_label") || "Nombre"}</label>
            <input
              type="text"
              name="name"
              placeholder={t("register.name_placeholder") || "Tu nombre"}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.errors.name && formik.touched.name && (
              <p className="error">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>{t("register.email_label") || "Email"}</label>
            <input
              type="email"
              name="email"
              placeholder={
                t("register.email_placeholder") || "Ingresá tu email"
              }
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              autoComplete="username"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="error">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>{t("register.password_label") || "Contraseña"}</label>
            <input
              type="password"
              name="password"
              placeholder={
                t("register.password_placeholder") ||
                "Ingresá tu contraseña (mín. 6)"
              }
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              autoComplete="new-password"
            />
            {formik.errors.password && formik.touched.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </div>

            {/* Repeat Password */}
          <div className="form-group">
            <label>
              {t("register.repeat_password_label") ||
                "Repetir contraseña"}
            </label>
            <input
              type="password"
              name="repeatPassword"
              placeholder={
                t("register.repeat_password_placeholder") ||
                "Volvé a escribir la contraseña"
              }
              value={formik.values.repeatPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              autoComplete="new-password"
            />
            {formik.errors.repeatPassword && formik.touched.repeatPassword && (
              <p className="error">{formik.errors.repeatPassword}</p>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label>
              {t("register.role_label") ||
                "¿Cómo querés usar la plataforma?"}
            </label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="user">
                {t("register.role_user") ||
                  "Quiero reservar experiencias"}
              </option>
              <option value="creator">
                {t("register.role_creator") ||
                  "Quiero publicar experiencias"}
              </option>
            </select>
            {formik.errors.role && formik.touched.role && (
              <p className="error">{formik.errors.role}</p>
            )}
          </div>

          {/* Error devuelto por backend */}
          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="btn-login"
            disabled={
              loading ||
              !formik.isValid || // hay errores de validación
              !formik.dirty      // nunca tocó el form
            }
          >
            {loading
              ? t("register.loading") || "Registrando..."
              : t("register.submit") || "Registrarme"}
          </button>

          <p className="register-link">
            {t("register.have_account") || "¿Ya tenés cuenta?"}{" "}
            <Link to="/">
              {t("register.login_here") || "Iniciá sesión"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
