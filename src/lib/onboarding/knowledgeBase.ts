interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  relatedArticles?: string[];
}

export const knowledgeBase = {
  articles: new Map<string, Article[]>(),

  createArticle: (article: Omit<Article, "id" | "lastUpdated">) => {
    const newArticle: Article = {
      id: crypto.randomUUID(),
      ...article,
      lastUpdated: new Date(),
    };

    const categoryArticles = knowledgeBase.articles.get(article.category) || [];
    categoryArticles.push(newArticle);
    knowledgeBase.articles.set(article.category, categoryArticles);

    return newArticle;
  },

  searchArticles: (query: string) => {
    const results: Article[] = [];
    knowledgeBase.articles.forEach((categoryArticles) => {
      const matches = categoryArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );
      results.push(...matches);
    });
    return results;
  },

  generateTableOfContents: () => {
    const toc: Record<string, { title: string; articles: string[] }> = {};
    knowledgeBase.articles.forEach((articles, category) => {
      toc[category] = {
        title: category,
        articles: articles.map((a) => a.title),
      };
    });
    return toc;
  },

  suggestRelatedArticles: (articleId: string) => {
    let article: Article | undefined;
    for (const [, articles] of knowledgeBase.articles) {
      article = articles.find((a) => a.id === articleId);
      if (article) break;
    }

    if (!article) return [];

    return knowledgeBase.searchArticles(article.tags.join(" "));
  },
};
