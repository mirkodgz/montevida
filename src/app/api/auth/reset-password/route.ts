import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import bcrypt from "bcryptjs";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: "El token y la nueva contraseña son requeridos." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
    }

    const now = new Date().toISOString();

    const query = `*[_type == "user" && resetPasswordToken == $token && resetPasswordExpires > $now][0]`;
    const user = await writeClient.fetch(query, { token, now });

    if (!user) {
      return NextResponse.json({ message: "El enlace de recuperación es inválido o ha expirado." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and remove the reset token fields
    await writeClient.patch(user._id).set({
      password: hashedPassword,
    }).unset(['resetPasswordToken', 'resetPasswordExpires']).commit();


    return NextResponse.json({ message: "Contraseña actualizada exitosamente." }, { status: 200 });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
