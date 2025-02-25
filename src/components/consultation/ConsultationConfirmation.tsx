import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Calendar, Download } from "lucide-react";
import { format } from "date-fns";

interface ConsultationConfirmationProps {
  appointmentDetails: {
    name: string;
    email: string;
    date: Date;
    appointmentId: string;
  };
  onClose: () => void;
}

export default function ConsultationConfirmation({
  appointmentDetails,
  onClose,
}: ConsultationConfirmationProps) {
  const addToCalendar = () => {
    const event = {
      title: "Consultation with Captivite",
      description: "Business automation consultation",
      startTime: appointmentDetails.date,
      endTime: new Date(appointmentDetails.date.getTime() + 60 * 60 * 1000), // 1 hour
      location: "Online",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title,
    )}&details=${encodeURIComponent(event.description)}&dates=${format(
      event.startTime,
      "yyyyMMdd'T'HHmmss'Z'",
    )}/${format(event.endTime, "yyyyMMdd'T'HHmmss'Z'")}&location=${encodeURIComponent(
      event.location,
    )}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <Card className="p-6 max-w-md mx-auto text-center space-y-6">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
        <Check className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Consultation Scheduled!</h2>
        <p className="text-muted-foreground">
          We look forward to meeting with you.
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg text-left space-y-2">
        <p>
          <strong>Name:</strong> {appointmentDetails.name}
        </p>
        <p>
          <strong>Email:</strong> {appointmentDetails.email}
        </p>
        <p>
          <strong>Date:</strong> {format(appointmentDetails.date, "PPP p")}
        </p>
        <p>
          <strong>Confirmation ID:</strong> {appointmentDetails.appointmentId}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={addToCalendar} className="w-full">
          <Calendar className="w-4 h-4 mr-2" /> Add to Calendar
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Card>
  );
}
