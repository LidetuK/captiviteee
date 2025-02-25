export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  language: string;
  variables: string[];
}

export const responseTemplates: ResponseTemplate[] = [
  {
    id: "review_response",
    name: "Review Response Template",
    content: "Thank you for your review. We value your feedback!",
    category: "reviews",
    language: "en",
    variables: ["rating", "sentiment", "reviewText"],
  },
  {
    id: "greeting",
    name: "Welcome Message",
    content:
      "Hello {{name}}, welcome to {{company}}! How can we assist you today?",
    category: "general",
    language: "en",
    variables: ["name", "company"],
  },
  {
    id: "appointment_confirmation",
    name: "Appointment Confirmation",
    content:
      "Your appointment has been scheduled for {{date}} at {{time}}. Reference: {{id}}",
    category: "scheduling",
    language: "en",
    variables: ["date", "time", "id"],
  },
  {
    id: "greeting_es",
    name: "Welcome Message (Spanish)",
    content:
      "¡Hola {{name}}, bienvenido a {{company}}! ¿Cómo podemos ayudarte hoy?",
    category: "general",
    language: "es",
    variables: ["name", "company"],
  },
];
