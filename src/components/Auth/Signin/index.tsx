"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Signin = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const callback = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (callback?.error) {
      toast.error(callback.error);
    }

    if (callback?.ok && !callback?.error) {
      toast.success("¡Sesión iniciada con éxito!");
      router.push("/");
      router.refresh();
    }
    
    setLoading(false);
  };
  return (
    <>
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Iniciar Sesión
              </h2>
              <p>Ingresa tus datos a continuación</p>
            </div>

            <div>
              <form onSubmit={loginUser}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Correo Electrónico
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    required
                    placeholder="Ingresa tu correo"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    required
                    placeholder="Ingresa tu contraseña"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50"
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>

                <Link
                  href="/olvidaste-contrasena"
                  className="block text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                >
                  ¿Olvidaste tu contraseña?
                </Link>

                

                <p className="text-center mt-6">
                  ¿No tienes una cuenta?
                  <Link
                    href="/registro"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    ¡Regístrate ahora!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
