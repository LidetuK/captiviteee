interface Shard {
  id: string;
  range: [number, number];
  node: string;
  status: "active" | "rebalancing" | "inactive";
  size: number;
}

export const shardManager = {
  shards: new Map<string, Shard[]>(),

  createShard: (serviceId: string, range: [number, number], node: string) => {
    const shard: Shard = {
      id: crypto.randomUUID(),
      range,
      node,
      status: "active",
      size: 0,
    };

    if (!shardManager.shards.has(serviceId)) {
      shardManager.shards.set(serviceId, []);
    }
    shardManager.shards.get(serviceId)?.push(shard);

    return shard;
  },

  getShard: (serviceId: string, key: number) => {
    const shards = shardManager.shards.get(serviceId) || [];
    return shards.find(
      (shard) =>
        key >= shard.range[0] &&
        key <= shard.range[1] &&
        shard.status === "active",
    );
  },

  rebalanceShards: async (serviceId: string) => {
    const shards = shardManager.shards.get(serviceId) || [];
    const totalSize = shards.reduce((sum, shard) => sum + shard.size, 0);
    const targetSize = totalSize / shards.length;

    const rebalancing = [];

    for (const shard of shards) {
      if (Math.abs(shard.size - targetSize) > targetSize * 0.2) {
        shard.status = "rebalancing";
        rebalancing.push(shard);
      }
    }

    // Implement rebalancing logic
    await Promise.all(
      rebalancing.map(async (shard) => {
        // Rebalance shard
        shard.status = "active";
      }),
    );

    return rebalancing;
  },

  addNode: async (serviceId: string, node: string) => {
    const shards = shardManager.shards.get(serviceId) || [];
    if (shards.length === 0) {
      return shardManager.createShard(serviceId, [0, 1000000], node);
    }

    // Find largest shard to split
    const largestShard = shards
      .filter((s) => s.status === "active")
      .sort((a, b) => b.size - a.size)[0];

    if (!largestShard) return null;

    const midPoint = Math.floor(
      (largestShard.range[1] + largestShard.range[0]) / 2,
    );
    const newShard = shardManager.createShard(
      serviceId,
      [midPoint + 1, largestShard.range[1]],
      node,
    );

    largestShard.range[1] = midPoint;

    return newShard;
  },
};
