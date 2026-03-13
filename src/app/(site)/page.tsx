import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monte Vida Peru | Inicio",
  description: "Bienvenido a la tienda oficial de Monte Vida Peru",
  // other metadata
  icons: {
    icon: "/images/logo/favicon-montevidaperu.webp",
  },
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
