import sgMail from "@sendgrid/mail";

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY || "");

export const sendConsultationEmail = async ({
  name,
  email,
  date,
  appointmentId,
}: {
  name: string;
  email: string;
  date: Date;
  appointmentId: string;
}) => {
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #000; font-size: 24px; font-weight: bold;">Consultation Confirmation</h1>
      <p style="color: #374151; font-size: 16px;">Dear ${name},</p>
      <p style="color: #374151; font-size: 16px;">Your consultation has been scheduled for ${date.toLocaleString()}.</p>
      <p style="color: #374151; font-size: 16px;">Confirmation ID: ${appointmentId}</p>
      <p style="color: #374151; font-size: 16px;">We look forward to meeting with you!</p>
    </div>
  `;

  const msg = {
    to: email,
    from: "noreply@captivite.ai",
    subject: "Consultation Confirmation",
    html: emailHtml,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
