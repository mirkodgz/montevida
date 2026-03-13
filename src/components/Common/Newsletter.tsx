"use client";

import React, { useState } from "react";
import Image from "next/image";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="overflow-hidden pb-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-1 overflow-hidden rounded-xl">
          {/* <!-- bg shapes --> */}
          <Image
            src="/images/shapes/newsletter-bg.jpg"
            alt="background illustration"
            className="absolute -z-1 w-full h-full left-0 top-0 rounded-xl"
            width={1170}
            height={200}
          />
          <div className="absolute -z-1 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-1"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-7.5 xl:pl-12.5 xl:pr-14 py-11">
            <div className="max-w-[491px] w-full">
              <h2 className="max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-heading-4 mb-3">
                No te pierdas las últimas novedades y ofertas
              </h2>
              <p className="text-white">
                Regístrate para recibir noticias sobre los últimos descuentos y cupones exclusivos.
              </p>
            </div>

            <div className="max-w-[477px] w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    className="w-full bg-white border border-transparent outline-none rounded-md placeholder:text-dark-4 py-3 px-5 text-dark"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="inline-flex justify-center whitespace-nowrap py-3 px-7 text-dark bg-green-brand font-medium rounded-md ease-out duration-200 hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Cargando..." : status === "success" ? "¡Suscrito!" : "Suscribirme"}
                  </button>
                </div>
                {status === "success" && (
                  <p className="text-green-brand text-sm mt-3 font-medium">¡Gracias por suscribirte! Revisa tu bandeja de entrada.</p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-sm mt-3 font-medium">Hubo un error al suscribirte. O tal vez tu dominio esté sin verificar en Resend.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
