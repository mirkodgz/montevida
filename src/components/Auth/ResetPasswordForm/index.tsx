"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Ocurrió un error al restablecer la contraseña.");
      }

      setSuccess(true);
      toast.success("¡Tu contraseña ha sido actualizada!");
      
      setTimeout(() => {
        router.push("/iniciar-sesion");
      }, 3000);
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
              Crea una nueva contraseña
            </h2>
            <p>Ingresa tu nueva contraseña a continuación.</p>
          </div>

          <div>
            {success ? (
              <div className="text-center text-green-600 mb-5 font-medium bg-green-brand/10 p-4 rounded-md">
                Tu contraseña ha sido actualizada exitosamente.
                <br />
                Redirigiendo al inicio de sesión...
                <br /><br />
                <Link href="/iniciar-sesion" className="text-blue underline">
                  Ir ahora
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Nueva Contraseña
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                
                <div className="mb-5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Confirmar Contraseña
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Escribe la misma contraseña"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Restablecer contraseña'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
