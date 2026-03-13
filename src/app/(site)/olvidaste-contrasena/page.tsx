import React from "react";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olvidaste tu contraseña | Montevida",
  description: "Recupera el acceso a tu cuenta de Montevida.",
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
