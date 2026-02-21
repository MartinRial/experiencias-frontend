import * as Yup from "yup";
import i18n from "../i18n";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Esquema estático (no reacciona al cambio de idioma en vivo)
export const loginSchema = Yup.object({
  email: Yup.string()
    .min(3, i18n.t("validations.email_min"))
    .matches(emailRegex, i18n.t("validations.email"))
    .required(i18n.t("validations.required")),
  password: Yup.string()
    .min(6, i18n.t("validations.min", { min: 6 }))
    .required(i18n.t("validations.password_required")),
});

// Esquema dinámico (cambia mensajes al cambiar idioma)
export const getLoginSchema = (t) =>
  Yup.object({
    email: Yup.string()
      .min(3, t("validations.email_min"))
      .matches(emailRegex, t("validations.email"))
      .required(t("validations.required")),
    password: Yup.string()
      .min(6, t("validations.min", { min: 6 }))
      .required(t("validations.password_required")),
  });

export const registerSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .min(2, t("validations.min_name", { min: 2 })) //  nombre con mensaje correcto
      .required(t("validations.required")),

    email: Yup.string()
      .email(t("validations.email"))
      .required(t("validations.required")),

    password: Yup.string()
      .min(6, t("validations.min_password", { min: 6 })) //  contraseña con mensaje correcto
      .required(t("validations.password_required")),

    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("validations.password_match"))
      .required(t("validations.password_required")),

    role: Yup.string()
      .oneOf(["user", "creator"], t("validations.role_invalid"))
      .required(t("validations.required")),
  });
