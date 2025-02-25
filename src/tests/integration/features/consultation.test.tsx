import { render, fireEvent, waitFor } from "@testing-library/react";
import ConsultationDialog from "@/components/consultation/ConsultationDialog";
import { api } from "@/lib/api";

jest.mock("@/lib/api");

describe("Consultation Feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits consultation request", async () => {
    const mockResponse = {
      success: true,
      appointmentId: "test-123",
    };

    (api.consultation.request as jest.Mock).mockResolvedValue(mockResponse);

    const { getByText, getByLabelText } = render(
      <ConsultationDialog open={true} onOpenChange={() => {}} />,
    );

    // Fill form
    fireEvent.change(getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });

    // Submit form
    fireEvent.click(getByText("Schedule Consultation"));

    await waitFor(() => {
      expect(api.consultation.request).toHaveBeenCalled();
    });
  });
});
