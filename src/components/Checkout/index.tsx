"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import PaymentMethod from "./PaymentMethod";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const Checkout = () => {
  const { items: cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { data: session } = useSession();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // Order Details
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = cartTotal > 0 ? 15 : 0; // Flat S/. 15 shipping fee example
  const orderTotal = cartTotal + shippingFee;

  // Form States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "Peru",
    phone: "",
    email: session?.user?.email || "",
    notes: "",
  });
  const [payment, setPayment] = useState("transferencia");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!session) {
      toast.error("Debes iniciar sesión para completar la compra.");
      router.push("/iniciar-sesion");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        formData,
        paymentMethod: payment,
        cartItems,
        cartTotal,
        shippingFee,
        orderTotal,
      };

      const res = await axios.post("/api/orders/create", payload);

      if (res.status === 201) {
        toast.success("¡Pedido procesado con éxito!");
        dispatch(removeAllItemsFromCart());
        router.push("/pedido-exitoso");
      }
      
    } catch (error: any) {
      toast.error(error.response?.data || "Ocurrió un error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleCheckout}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                {!session && <Login />}

                {/* <!-- billing details merged --> */}
                <div className="mt-9">
                  <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
                    Detalles de Facturación y Entrega
                  </h2>

                  <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                    <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                      <div className="w-full">
                        <label className="block mb-2.5">
                          Nombres <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2.5">
                          Apellidos <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block mb-2.5">
                        Dirección <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Av, Calle, Nro"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="mb-5">
                      <label className="block mb-2.5">
                        Ciudad / Distrito <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                      <div className="w-full">
                        <label className="block mb-2.5">
                          Teléfono <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block mb-2.5">
                          Correo Electrónico <span className="text-red">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Notas Adicionales (opcional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ej. Dejar en consejería, llamar al llegar..."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Tu Pedido
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Producto</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product items mapped --> */}
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div className="flex items-center gap-3">
                          {item.imgs?.thumbnails?.[0] && (
                            <Image src={item.imgs.thumbnails[0]} alt={item.title} width={40} height={40} className="rounded-md object-cover" />
                          )}
                          <p className="text-dark max-w-[150px] truncate" title={item.title}>{item.title} <span className="text-dark-5 font-semibold text-sm">x {item.quantity}</span></p>
                        </div>
                        <div>
                          <p className="text-dark text-right">S/. {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- shipping item --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark font-medium">Costo de Envío</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">S/. {shippingFee.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-semibold text-xl text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-blue text-right">
                          S/. {orderTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- payment box --> */}
                <PaymentMethod payment={payment} setPayment={setPayment} />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50"
                >
                  {loading ? "Procesando Pedido..." : "Finalizar Pedido"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
