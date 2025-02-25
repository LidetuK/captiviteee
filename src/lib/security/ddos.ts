interface RateLimit {
  ip: string;
  requests: number;
  lastRequest: number;
  blocked: boolean;
}

export const ddosProtection = {
  rateLimits: new Map<string, RateLimit>(),
  thresholds: {
    requestsPerMinute: 100,
    blockDuration: 300000, // 5 minutes
  },

  checkRequest: (ip: string): boolean => {
    const now = Date.now();
    const limit = ddosProtection.rateLimits.get(ip) || {
      ip,
      requests: 0,
      lastRequest: now,
      blocked: false,
    };

    // Check if IP is blocked
    if (limit.blocked) {
      if (now - limit.lastRequest > ddosProtection.thresholds.blockDuration) {
        limit.blocked = false;
        limit.requests = 0;
      } else {
        return false;
      }
    }

    // Reset counter after 1 minute
    if (now - limit.lastRequest > 60000) {
      limit.requests = 0;
      limit.lastRequest = now;
    }

    // Increment request counter
    limit.requests++;

    // Block IP if threshold exceeded
    if (limit.requests > ddosProtection.thresholds.requestsPerMinute) {
      limit.blocked = true;
      ddosProtection.rateLimits.set(ip, limit);
      return false;
    }

    ddosProtection.rateLimits.set(ip, limit);
    return true;
  },

  getBlockedIPs: (): string[] => {
    return Array.from(ddosProtection.rateLimits.values())
      .filter((limit) => limit.blocked)
      .map((limit) => limit.ip);
  },

  unblockIP: (ip: string): void => {
    const limit = ddosProtection.rateLimits.get(ip);
    if (limit) {
      limit.blocked = false;
      limit.requests = 0;
      ddosProtection.rateLimits.set(ip, limit);
    }
  },
};
