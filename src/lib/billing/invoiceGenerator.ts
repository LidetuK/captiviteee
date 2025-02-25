interface Invoice {
  id: string;
  userId: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "void";
  dueDate: Date;
  createdAt: Date;
}

export const invoiceGenerator = {
  invoices: new Map<string, Invoice[]>(),

  generateInvoice: async (
    userId: string,
    items: Array<{ description: string; quantity: number; unitPrice: number }>,
  ) => {
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      userId,
      items: items.map((item) => ({
        ...item,
        amount: item.quantity * item.unitPrice,
      })),
      subtotal: 0,
      tax: 0,
      total: 0,
      status: "draft",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    // Calculate totals
    invoice.subtotal = invoice.items.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    invoice.tax = invoice.subtotal * 0.1; // 10% tax
    invoice.total = invoice.subtotal + invoice.tax;

    if (!invoiceGenerator.invoices.has(userId)) {
      invoiceGenerator.invoices.set(userId, []);
    }
    invoiceGenerator.invoices.get(userId)?.push(invoice);

    return invoice;
  },

  getInvoice: (invoiceId: string) => {
    for (const invoices of invoiceGenerator.invoices.values()) {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) return invoice;
    }
    return null;
  },

  getUserInvoices: (userId: string) => {
    return invoiceGenerator.invoices.get(userId) || [];
  },

  markAsPaid: async (invoiceId: string) => {
    const invoice = invoiceGenerator.getInvoice(invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    invoice.status = "paid";
    return invoice;
  },
};
