import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse("No Autorizado", { status: 401 });
    }

    const body = await req.json();
    const { formData, paymentMethod, cartItems, cartTotal, shippingFee, orderTotal } = body;

    // Obtener el ID del usuario en Sanity a través de su correo
    const userQuery = `*[_type == "user" && email == $email][0]._id`;
    const userId = await client.fetch(userQuery, { email: session.user.email });

    if (!userId) {
      return new NextResponse("Usuario no encontrado en la base de datos.", { status: 404 });
    }

    // Formatear los line items
    const formattedItems = cartItems.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.id, // Ensure this matches the Sanity Product Document ID
      },
      quantity: item.quantity,
      priceAtPurchase: item.price,
    }));

    // Generar número de orden (EJ: ORD-1701234567)
    const orderNumber = `ORD-${Date.now()}`;

    // Crear el documento de la orden en Sanity
    const newOrder = await client.create({
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: userId,
      },
      items: formattedItems,
      totalAmount: orderTotal,
      paymentMethod,
      status: "pending",
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
      },
      orderDate: new Date().toISOString(),
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("ORDER_CREATE_ERROR:", error);
    return new NextResponse(error.message || "Error Interno del Servidor", { status: 500 });
  }
}
