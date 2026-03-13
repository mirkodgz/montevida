import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Send a welcome email to the subscriber using the verified domain.
        // NOTE: The from address must be a domain you have verified in Resend.
        // If "montevida.pe" is not fully verified yet, this might fail unless you use onboarding@resend.dev
        // and send it only to the email address registered in your Resend account.
        const { data, error } = await resend.emails.send({
            from: "Montevida <hola@montevida.pe>", // Replace with onboarding@resend.dev if testing without domain
            to: [email],
            bcc: ["soporte@montevida.pe"], // Notifies the store owner
            subject: "¡Bienvenido a Montevida! 🐻",
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #4CAF50;">¡Hola! Gracias por suscribirte a Montevida</h2>
          <p>Nos alegra tenerte en nuestra comunidad. Serás el primero en enterarte de nuestras promociones exclusivas, nuevos lanzamientos y más.</p>
          <p>Como agradecimiento, aquí tienes un cupón de <strong>10% OFF</strong> en tu primera compra:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 2px; margin: 20px 0;">
            BIENVENIDO10
          </div>
          <p>¡Esperamos que disfrutes de nuestras gomitas nutritivas!</p>
          <p>Saludos,<br/>El equipo de Montevida</p>
        </div>
      `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
