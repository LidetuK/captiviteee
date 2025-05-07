import React, { createContext, useContext, useState, ReactNode } from "react";

type MockUser = {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
};

type MockAuthContextType = {
  isAuthenticated: boolean;
  user: MockUser | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
};

const MockAuthContext = createContext<MockAuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ error: null }),
  logout: async () => {},
});

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = async (email: string, password: string) => {
    // Always succeed with demo credentials
    if (email === "demo@captivite.com" && password === "demo123") {
      const mockUser: MockUser = {
        id: "mock-user-id",
        email: "demo@captivite.com",
        user_metadata: {
          full_name: "Demo User",
        },
      };
      setUser(mockUser);
      // Store in localStorage for persistence
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      return { error: null };
    }

    return { error: new Error("Invalid credentials") };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("mockUser");
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("mockUser");
      }
    }
  }, []);

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(MockAuthContext);
