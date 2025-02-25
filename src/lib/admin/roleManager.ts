interface Role {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  metadata?: Record<string, any>;
}

export const roleManager = {
  roles: new Map<string, Role>(),

  createRole: async (roleData: Omit<Role, "id">) => {
    const role: Role = {
      id: crypto.randomUUID(),
      ...roleData,
    };

    roleManager.roles.set(role.id, role);
    return role;
  },

  updateRole: async (roleId: string, updates: Partial<Role>) => {
    const role = roleManager.roles.get(roleId);
    if (!role) throw new Error("Role not found");

    const updatedRole = { ...role, ...updates };
    roleManager.roles.set(roleId, updatedRole);
    return updatedRole;
  },

  deleteRole: async (roleId: string) => {
    return roleManager.roles.delete(roleId);
  },

  getRole: (roleId: string) => {
    return roleManager.roles.get(roleId);
  },

  listRoles: () => {
    return Array.from(roleManager.roles.values());
  },

  assignPermissions: async (roleId: string, permissions: string[]) => {
    const role = roleManager.roles.get(roleId);
    if (!role) throw new Error("Role not found");

    role.permissions = [...new Set([...role.permissions, ...permissions])];
    roleManager.roles.set(roleId, role);
    return role;
  },

  removePermissions: async (roleId: string, permissions: string[]) => {
    const role = roleManager.roles.get(roleId);
    if (!role) throw new Error("Role not found");

    role.permissions = role.permissions.filter((p) => !permissions.includes(p));
    roleManager.roles.set(roleId, role);
    return role;
  },
};
