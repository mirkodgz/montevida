import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entityType, firstName, lastName, email, ruc, subject, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, apellido, correo y mensaje son requeridos." },
        { status: 400 }
      );
    }

    const isEmpresa = entityType === "Empresa";
    const rucRow = isEmpresa
      ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">RUC:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${ruc || "No proporcionado"}</td>
          </tr>
        `
      : "";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Nuevo Mensaje de Contacto</h2>
        <p>Has recibido un nuevo mensaje a través del formulario de contacto.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Tipo de Entidad:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${entityType || "Persona Natural"}</td>
          </tr>
          ${rucRow}
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nombre Completo:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Correo:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Asunto:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${subject || "Sin asunto"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Teléfono:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone || "No proporcionado"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mensaje:</td>
            <td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Montevida Contacto <hola@montevida.pe>", // You need a verified domain to send from
      to: ["soporte@montevida.pe"], // Delivering to the store owner
      replyTo: email, // Set the reply-to header
      subject: `Nuevo mensaje de contacto: ${subject || "Sin asunto"}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
