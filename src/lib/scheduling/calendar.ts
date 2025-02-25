import { createClient } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";

interface Appointment {
  id: string;
  startTime: Date;
  endTime: Date;
  userId: string;
  providerId: string;
  status: "scheduled" | "confirmed" | "cancelled";
  type: string;
}

interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export const calendar = {
  getAvailability: async (
    providerId: string,
    date: Date,
  ): Promise<TimeSlot[]> => {
    // For demo, return mock availability
    const workStart = new Date(date.setHours(9, 0, 0));
    const workEnd = new Date(date.setHours(17, 0, 0));

    const slots: TimeSlot[] = [];
    let current = workStart;

    while (current < workEnd) {
      slots.push({
        start: new Date(current),
        end: new Date(current.setMinutes(current.getMinutes() + 30)),
        available: Math.random() > 0.3, // 70% slots available
      });
      current = new Date(current.setMinutes(current.getMinutes() + 30));
    }

    return slots;
  },

  scheduleAppointment: async (
    appointment: Omit<Appointment, "id">,
  ): Promise<Appointment> => {
    // Check for conflicts
    const conflicts = await calendar.checkConflicts(
      appointment.startTime,
      appointment.endTime,
      appointment.providerId,
    );

    if (conflicts) {
      throw new Error("Time slot is not available");
    }

    // For demo, return mock appointment
    return {
      id: crypto.randomUUID(),
      ...appointment,
      status: "scheduled",
    };
  },

  checkConflicts: async (
    start: Date,
    end: Date,
    providerId: string,
  ): Promise<boolean> => {
    const availability = await calendar.getAvailability(providerId, start);
    const slot = availability.find(
      (slot) =>
        slot.start.getTime() === start.getTime() &&
        slot.end.getTime() === end.getTime(),
    );

    return !slot?.available;
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    // Implement cancellation logic
  },

  rescheduleAppointment: async (
    appointmentId: string,
    newStart: Date,
    newEnd: Date,
  ): Promise<Appointment> => {
    // Check new slot availability
    const conflicts = await calendar.checkConflicts(
      newStart,
      newEnd,
      "provider-id", // You would get this from the original appointment
    );

    if (conflicts) {
      throw new Error("New time slot is not available");
    }

    // For demo, return mock rescheduled appointment
    return {
      id: appointmentId,
      startTime: newStart,
      endTime: newEnd,
      userId: "user-id",
      providerId: "provider-id",
      status: "scheduled",
      type: "consultation",
    };
  },
};
