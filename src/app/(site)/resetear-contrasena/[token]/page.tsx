import React from "react";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer tu contraseña | Montevida",
  description: "Crea una nueva contraseña para tu cuenta de Montevida.",
};

interface Props {
  params: {
    token: string;
  };
}

const ResetPasswordPage = ({ params }: Props) => {
  return <ResetPasswordForm token={params.token} />;
};

export default ResetPasswordPage;
