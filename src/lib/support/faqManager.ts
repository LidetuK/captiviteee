interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  helpful: number;
  notHelpful: number;
}

export const faqManager = {
  faqs: new Map<string, FAQ[]>(),

  addFAQ: (faq: Omit<FAQ, "id" | "lastUpdated" | "helpful" | "notHelpful">) => {
    const newFAQ: FAQ = {
      id: crypto.randomUUID(),
      ...faq,
      lastUpdated: new Date(),
      helpful: 0,
      notHelpful: 0,
    };

    const categoryFAQs = faqManager.faqs.get(faq.category) || [];
    categoryFAQs.push(newFAQ);
    faqManager.faqs.set(faq.category, categoryFAQs);

    return newFAQ;
  },

  searchFAQs: (query: string): FAQ[] => {
    const results: FAQ[] = [];
    faqManager.faqs.forEach((faqs) => {
      const matches = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase()) ||
          faq.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );
      results.push(...matches);
    });
    return results;
  },

  getFAQsByCategory: (category: string): FAQ[] => {
    return faqManager.faqs.get(category) || [];
  },

  updateFAQ: (faqId: string, updates: Partial<FAQ>): FAQ | null => {
    let updatedFAQ: FAQ | null = null;

    faqManager.faqs.forEach((faqs, category) => {
      const faqIndex = faqs.findIndex((f) => f.id === faqId);
      if (faqIndex >= 0) {
        updatedFAQ = {
          ...faqs[faqIndex],
          ...updates,
          lastUpdated: new Date(),
        };
        faqs[faqIndex] = updatedFAQ;
        faqManager.faqs.set(category, faqs);
      }
    });

    return updatedFAQ;
  },

  provideFeedback: (faqId: string, helpful: boolean): FAQ | null => {
    let updatedFAQ: FAQ | null = null;

    faqManager.faqs.forEach((faqs, category) => {
      const faqIndex = faqs.findIndex((f) => f.id === faqId);
      if (faqIndex >= 0) {
        updatedFAQ = {
          ...faqs[faqIndex],
          helpful: helpful
            ? faqs[faqIndex].helpful + 1
            : faqs[faqIndex].helpful,
          notHelpful: helpful
            ? faqs[faqIndex].notHelpful
            : faqs[faqIndex].notHelpful + 1,
        };
        faqs[faqIndex] = updatedFAQ;
        faqManager.faqs.set(category, faqs);
      }
    });

    return updatedFAQ;
  },
};
