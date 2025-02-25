interface ResourceAllocation {
  id: string;
  resourceType: string;
  quantity: number;
  cost: number;
  department: string;
  project?: string;
  startDate: Date;
  endDate?: Date;
}

export const resourceAllocation = {
  allocations: new Map<string, ResourceAllocation[]>(),

  allocateResource: async (allocation: Omit<ResourceAllocation, "id">) => {
    const newAllocation: ResourceAllocation = {
      id: crypto.randomUUID(),
      ...allocation,
    };

    if (!resourceAllocation.allocations.has(allocation.department)) {
      resourceAllocation.allocations.set(allocation.department, []);
    }
    resourceAllocation.allocations
      .get(allocation.department)
      ?.push(newAllocation);

    return newAllocation;
  },

  getDepartmentAllocations: (department: string) => {
    return resourceAllocation.allocations.get(department) || [];
  },

  getProjectAllocations: (project: string) => {
    const projectAllocations: ResourceAllocation[] = [];
    resourceAllocation.allocations.forEach((allocations) => {
      projectAllocations.push(
        ...allocations.filter((a) => a.project === project),
      );
    });
    return projectAllocations;
  },

  calculateCosts: (timeRange?: { start: Date; end: Date }) => {
    const costs: Record<
      string,
      {
        department: string;
        total: number;
        byResource: Record<string, number>;
      }
    > = {};

    resourceAllocation.allocations.forEach((allocations, department) => {
      const filteredAllocations = timeRange
        ? allocations.filter(
            (a) =>
              a.startDate >= timeRange.start &&
              (!a.endDate || a.endDate <= timeRange.end),
          )
        : allocations;

      const departmentCosts = {
        department,
        total: 0,
        byResource: {},
      };

      filteredAllocations.forEach((allocation) => {
        const cost = allocation.quantity * allocation.cost;
        departmentCosts.total += cost;
        departmentCosts.byResource[allocation.resourceType] =
          (departmentCosts.byResource[allocation.resourceType] || 0) + cost;
      });

      costs[department] = departmentCosts;
    });

    return costs;
  },

  optimizeAllocations: () => {
    const recommendations = [];
    const departmentCosts = resourceAllocation.calculateCosts();

    Object.values(departmentCosts).forEach((dept) => {
      const totalCost = dept.total;
      const resourceCosts = Object.entries(dept.byResource);

      // Check for high-cost resources
      resourceCosts.forEach(([resource, cost]) => {
        if (cost / totalCost > 0.4) {
          recommendations.push(
            `High ${resource} costs in ${dept.department} department (${Math.round(
              (cost / totalCost) * 100,
            )}% of budget)`,
          );
        }
      });

      // Check for underutilized resources
      const allocations = resourceAllocation.getDepartmentAllocations(
        dept.department,
      );
      const utilizationByResource: Record<string, number> = {};

      allocations.forEach((allocation) => {
        utilizationByResource[allocation.resourceType] =
          (utilizationByResource[allocation.resourceType] || 0) +
          allocation.quantity;
      });

      Object.entries(utilizationByResource).forEach(([resource, quantity]) => {
        if (quantity < 0.5) {
          recommendations.push(
            `Low utilization of ${resource} in ${dept.department} department (${Math.round(
              quantity * 100,
            )}%)`,
          );
        }
      });
    });

    return recommendations;
  },
};
