import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConsultationForm from "./ConsultationForm";
import ConsultationConfirmation from "./ConsultationConfirmation";
import { api } from "@/lib/api";
import { sendConsultationEmail } from "@/lib/email";
import { useToast } from "@/components/ui/use-toast";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConsultationDialog({
  open,
  onOpenChange,
}: ConsultationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmationData, setConfirmationData] = React.useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.consultation.request(data);

      // Send confirmation email
      await sendConsultationEmail({
        name: data.name,
        email: data.email,
        date: data.date,
        appointmentId: response.appointmentId,
      });

      setConfirmationData({
        ...data,
        appointmentId: response.appointmentId,
      });

      toast({
        title: "Consultation Scheduled",
        description: "You will receive a confirmation email shortly.",
      });
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      toast({
        title: "Error",
        description: "There was an error scheduling your consultation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationData(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-br from-background via-accent/5 to-background">
        {confirmationData ? (
          <ConsultationConfirmation
            appointmentDetails={confirmationData}
            onClose={handleClose}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                Schedule a Demo
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Let's explore how Captivite can transform your business
                operations
              </DialogDescription>
            </DialogHeader>
            <ConsultationForm onSubmit={handleSubmit} isLoading={isLoading} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
