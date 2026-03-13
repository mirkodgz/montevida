import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Faltan datos obligatorios", { status: 400 });
    }

    // Comprobar si existe alguien con ese correo
    const existingUserQuery = `*[_type == "user" && email == $email][0]`;
    const existingUser = await client.fetch(existingUserQuery, { email });

    if (existingUser) {
      return new NextResponse("El correo ya está registrado.", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Atención: Esto usa un token de mutación si se configuró, el cliente por defecto "fetch" no muta a menos que usemos tokens
    // Si tu cliente base no tiene token de modificación o "useCdn: false" no da permisos, fallará
    // Asumiremos que el cliente tiene el token para hacerlo
    const newUser = await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      role: "customer",
      provider: "credentials",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("REGISTER_ERROR", error);
    return new NextResponse(error.message || "Error Interno del Servidor", { status: 500 });
  }
}
