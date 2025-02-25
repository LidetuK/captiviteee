interface Ticket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  category: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ticketManager = {
  tickets: new Map<string, Ticket[]>(),

  createTicket: async (
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">,
  ) => {
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      ...ticket,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userTickets = ticketManager.tickets.get(ticket.userId) || [];
    userTickets.push(newTicket);
    ticketManager.tickets.set(ticket.userId, userTickets);

    return newTicket;
  },

  updateTicket: async (ticketId: string, updates: Partial<Ticket>) => {
    let updatedTicket: Ticket | null = null;

    ticketManager.tickets.forEach((tickets, userId) => {
      const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
      if (ticketIndex >= 0) {
        updatedTicket = {
          ...tickets[ticketIndex],
          ...updates,
          updatedAt: new Date(),
        };
        tickets[ticketIndex] = updatedTicket;
        ticketManager.tickets.set(userId, tickets);
      }
    });

    return updatedTicket;
  },

  getTicket: (ticketId: string): Ticket | null => {
    for (const tickets of ticketManager.tickets.values()) {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) return ticket;
    }
    return null;
  },

  getUserTickets: (userId: string): Ticket[] => {
    return ticketManager.tickets.get(userId) || [];
  },

  searchTickets: (query: string): Ticket[] => {
    const results: Ticket[] = [];
    ticketManager.tickets.forEach((tickets) => {
      const matches = tickets.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
          ticket.description.toLowerCase().includes(query.toLowerCase()),
      );
      results.push(...matches);
    });
    return results;
  },
};
