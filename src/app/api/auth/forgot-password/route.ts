import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "El correo es requerido." }, { status: 400 });
    }

    const query = `*[_type == "user" && email == $email][0]`;
    const user = await writeClient.fetch(query, { email });

    // For security reasons, do not leak whether the email exists.
    if (!user) {
      return NextResponse.json({ message: "Si el correo está registrado, recibirás un enlace de recuperación." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await writeClient.patch(user._id).set({
      resetPasswordToken: token,
      resetPasswordExpires: expires
    }).commit();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/resetear-contrasena/${token}`;

    const { data, error } = await resend.emails.send({
      from: "Montevida <notificaciones@montevida.pe>",
      to: email,
      subject: "Recuperación de Contraseña - Montevida",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hola ${user.name || ''},</h2>
          <p>Has solicitado restablecer tu contraseña en Montevida.</p>
          <p>Haz clic en el enlace de abajo para elegir una nueva contraseña:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#bbeb76;color:#000;text-decoration:none;border-radius:5px;margin-top:20px;font-weight:bold;">Restablecer Contraseña</a>
          <p style="margin-top:20px;color:#555;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="margin-top:40px; font-size: 12px; color: #999;">Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ message: "Error enviando correo." }, { status: 500 });
    }

    return NextResponse.json({ message: "Si el correo está registrado, recibirás un enlace de recuperación." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
