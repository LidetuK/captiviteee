interface User {
  id: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  permissions: string[];
  metadata: Record<string, any>;
  lastLogin?: Date;
}

export const userManager = {
  users: new Map<string, User>(),

  createUser: async (userData: Omit<User, "id">) => {
    const user: User = {
      id: crypto.randomUUID(),
      ...userData,
      status: "active",
      lastLogin: new Date(),
    };

    userManager.users.set(user.id, user);
    return user;
  },

  updateUser: async (userId: string, updates: Partial<User>) => {
    const user = userManager.users.get(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, ...updates };
    userManager.users.set(userId, updatedUser);
    return updatedUser;
  },

  deleteUser: async (userId: string) => {
    return userManager.users.delete(userId);
  },

  getUser: (userId: string) => {
    return userManager.users.get(userId);
  },

  listUsers: (filters?: Partial<User>) => {
    let users = Array.from(userManager.users.values());

    if (filters) {
      users = users.filter((user) => {
        return Object.entries(filters).every(
          ([key, value]) => user[key] === value,
        );
      });
    }

    return users;
  },
};
