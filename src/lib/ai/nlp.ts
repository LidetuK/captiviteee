import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const nlp = {
  classifyIntent: async (text: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Classify the intent of the following customer message",
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
    });
    return response.choices[0].message.content;
  },

  extractEntities: async (text: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Extract named entities (dates, times, names, etc) from the text",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  },

  analyzeSentiment: async (text: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Analyze the sentiment of this text and return a score from -1 to 1",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
    });
    return parseFloat(response.choices[0].message.content || "0");
  },

  getNextAction: async (context: any) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Based on the conversation context, determine the next best action",
        },
        { role: "user", content: JSON.stringify(context) },
      ],
      temperature: 0.5,
    });
    return response.choices[0].message.content;
  },

  detectLanguage: async (text: string): Promise<string> => {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Detect the language of the following text and return the ISO code",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
    });
    return response.choices[0].message.content || "en";
  },
};
