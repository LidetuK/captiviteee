interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export const chatManager = {
  conversations: new Map<string, ChatMessage[]>(),

  sendMessage: async (userId: string, content: string) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content,
      timestamp: new Date(),
      status: "sent",
    };

    const conversation = chatManager.conversations.get(userId) || [];
    conversation.push(message);
    chatManager.conversations.set(userId, conversation);

    return message;
  },

  getMessages: (userId: string) => {
    return chatManager.conversations.get(userId) || [];
  },

  markAsRead: (userId: string, messageId: string) => {
    const conversation = chatManager.conversations.get(userId) || [];
    const message = conversation.find((m) => m.id === messageId);
    if (message) {
      message.status = "read";
    }
    return message;
  },
};
