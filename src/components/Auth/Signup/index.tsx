"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Signup = () => {
  const [data, setData] = useState({ name: "", email: "", password: "", retypePassword: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (data.password !== data.retypePassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', data);
      
      if (response.status === 201) {
        toast.success("¡Cuenta creada exitosamente!");
        // Auto-login after registration
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Ocurrió un error al registrarse.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Crear una Cuenta
              </h2>
              <p>Ingresa tus datos a continuación</p>
            </div>



            <div className="mt-5.5">
              <form onSubmit={registerUser}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Nombre Completo <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                    placeholder="Ingresa tu nombre completo"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Correo Electrónico <span className="text-red">*</span>
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
                    Contraseña <span className="text-red">*</span>
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

                <div className="mb-5.5">
                  <label htmlFor="re-type-password" className="block mb-2.5">
                    Repetir Contraseña <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="re-type-password"
                    id="re-type-password"
                    value={data.retypePassword}
                    onChange={(e) => setData({ ...data, retypePassword: e.target.value })}
                    required
                    placeholder="Repite tu contraseña"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50"
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>

                <p className="text-center mt-6">
                  ¿Ya tienes una cuenta?
                  <Link
                    href="/iniciar-sesion"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Inicia Sesión
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

export default Signup;
