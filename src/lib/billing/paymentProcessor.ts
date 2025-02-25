interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  method: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const paymentProcessor = {
  payments: new Map<string, Payment[]>(),

  processPayment: async (userId: string, amount: number, method: string) => {
    const payment: Payment = {
      id: crypto.randomUUID(),
      userId,
      amount,
      currency: "USD",
      status: "pending",
      method,
      timestamp: new Date(),
    };

    try {
      // Process payment logic here
      payment.status = "completed";
    } catch (error) {
      payment.status = "failed";
      throw error;
    }

    if (!paymentProcessor.payments.has(userId)) {
      paymentProcessor.payments.set(userId, []);
    }
    paymentProcessor.payments.get(userId)?.push(payment);

    return payment;
  },

  getPaymentHistory: (userId: string) => {
    return paymentProcessor.payments.get(userId) || [];
  },

  refundPayment: async (paymentId: string) => {
    let payment: Payment | undefined;
    for (const [userId, payments] of paymentProcessor.payments) {
      payment = payments.find((p) => p.id === paymentId);
      if (payment) {
        // Process refund logic here
        const refund = {
          id: crypto.randomUUID(),
          originalPaymentId: paymentId,
          amount: payment.amount,
          status: "completed",
          timestamp: new Date(),
        };
        return refund;
      }
    }
    throw new Error("Payment not found");
  },
};
