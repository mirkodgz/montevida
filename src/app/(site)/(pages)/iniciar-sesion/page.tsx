import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Página de Inicio de Sesión | Monte Vida Peru",
  description: "Esta es la página de inicio de sesión para Monte Vida Peru",
  // other metadata
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;
