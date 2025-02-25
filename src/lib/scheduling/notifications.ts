import { sendConsultationEmail } from "../email";

export const notifications = {
  sendAppointmentConfirmation: async (appointment: any) => {
    await sendConsultationEmail({
      name: appointment.userName,
      email: appointment.userEmail,
      date: appointment.startTime,
      appointmentId: appointment.id,
    });
  },

  sendReminder: async (appointment: any) => {
    // Send reminder email
    await sendConsultationEmail({
      name: appointment.userName,
      email: appointment.userEmail,
      date: appointment.startTime,
      appointmentId: appointment.id,
    });
  },

  sendCancellation: async (appointment: any) => {
    // Send cancellation email
    await sendConsultationEmail({
      name: appointment.userName,
      email: appointment.userEmail,
      date: appointment.startTime,
      appointmentId: appointment.id,
    });
  },
};
