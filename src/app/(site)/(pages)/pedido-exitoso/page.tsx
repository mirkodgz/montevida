import Breadcrumb from "@/components/Common/Breadcrumb";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pedido Exitoso | Monte Vida Peru",
  description: "Gracias por tu compra en Monte Vida",
};

const SuccessPage = () => {
  return (
    <main>
      <Breadcrumb title={"Pedido Exitoso"} pages={["pedido-exitoso"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-8 sm:p-12 text-center">
            
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <h2 className="font-semibold text-2xl sm:text-heading-5 text-dark mb-4">
              ¡Gracias por tu compra!
            </h2>
            <p className="text-dark-5 mb-8">
              Tu pedido ha sido recibido y está siendo procesado. Hemos enviado un correo con los detalles de tu compra y las instrucciones para el pago manual.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex justify-center font-medium text-dark border border-gray-3 bg-white py-3 px-6 rounded-lg ease-out duration-200 hover:bg-gray-2"
              >
                Volver al Inicio
              </Link>
              {/* If they are logged in and you build a dashboard later */}
              {/* <Link
                href="/mi-cuenta"
                className="inline-flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue-dark"
              >
                Ver mis Pedidos
              </Link> */}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessPage;
