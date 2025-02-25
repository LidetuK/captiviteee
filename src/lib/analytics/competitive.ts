interface CompetitorMetrics {
  name: string;
  metrics: Record<string, number>;
  timestamp: Date;
}

export const competitiveAnalysis = {
  competitors: new Map<string, CompetitorMetrics[]>(),

  trackCompetitor: (name: string, metrics: Record<string, number>) => {
    const data: CompetitorMetrics = {
      name,
      metrics,
      timestamp: new Date(),
    };

    if (!competitiveAnalysis.competitors.has(name)) {
      competitiveAnalysis.competitors.set(name, []);
    }
    competitiveAnalysis.competitors.get(name)?.push(data);

    return data;
  },

  getCompetitorMetrics: (name: string) => {
    return competitiveAnalysis.competitors.get(name) || [];
  },

  compareMetrics: (metric: string) => {
    const comparison = Array.from(competitiveAnalysis.competitors.entries())
      .map(([name, data]) => {
        const latest = data[data.length - 1];
        return {
          name,
          value: latest?.metrics[metric] || 0,
          timestamp: latest?.timestamp,
        };
      })
      .sort((a, b) => b.value - a.value);

    return comparison;
  },

  getMarketPosition: (metric: string) => {
    const comparison = competitiveAnalysis.compareMetrics(metric);
    const totalCompetitors = comparison.length;
    if (totalCompetitors === 0) return null;

    const ourPosition = comparison.findIndex((c) => c.name === "our_company");
    if (ourPosition === -1) return null;

    return {
      rank: ourPosition + 1,
      totalCompetitors,
      percentile: ((totalCompetitors - ourPosition) / totalCompetitors) * 100,
      leader: comparison[0],
      gap: comparison[0].value - comparison[ourPosition].value,
    };
  },
};
