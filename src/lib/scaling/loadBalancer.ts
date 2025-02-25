interface ServiceNode {
  id: string;
  url: string;
  health: number;
  lastCheck: Date;
  status: "active" | "draining" | "inactive";
}

export const loadBalancer = {
  nodes: new Map<string, ServiceNode[]>(),

  registerNode: (serviceId: string, url: string) => {
    const node: ServiceNode = {
      id: crypto.randomUUID(),
      url,
      health: 1,
      lastCheck: new Date(),
      status: "active",
    };

    if (!loadBalancer.nodes.has(serviceId)) {
      loadBalancer.nodes.set(serviceId, []);
    }
    loadBalancer.nodes.get(serviceId)?.push(node);

    return node;
  },

  getNextNode: (serviceId: string) => {
    const nodes = loadBalancer.nodes.get(serviceId) || [];
    const activeNodes = nodes.filter(
      (n) => n.status === "active" && n.health > 0.5,
    );

    if (activeNodes.length === 0) return null;

    // Round-robin selection weighted by health
    const totalHealth = activeNodes.reduce((sum, node) => sum + node.health, 0);
    let random = Math.random() * totalHealth;

    for (const node of activeNodes) {
      random -= node.health;
      if (random <= 0) return node;
    }

    return activeNodes[0];
  },

  updateHealth: (serviceId: string, nodeId: string, health: number) => {
    const nodes = loadBalancer.nodes.get(serviceId) || [];
    const node = nodes.find((n) => n.id === nodeId);

    if (node) {
      node.health = Math.max(0, Math.min(1, health));
      node.lastCheck = new Date();
    }

    return node;
  },

  drainNode: async (serviceId: string, nodeId: string) => {
    const nodes = loadBalancer.nodes.get(serviceId) || [];
    const node = nodes.find((n) => n.id === nodeId);

    if (node) {
      node.status = "draining";
      // Wait for active connections to complete
      await new Promise((resolve) => setTimeout(resolve, 5000));
      node.status = "inactive";
    }

    return node;
  },
};
