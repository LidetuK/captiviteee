import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ error: null }),
  logout: async () => {},
  loading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client with fallback values if env vars are not available
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || "https://fallback-url.supabase.co";
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || "fallback-key";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    // Check for stored user on mount first (for demo login persistence)
    const storedUser = localStorage.getItem("captiviteUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return; // Skip Supabase session check if we have a stored user
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("captiviteUser");
      }
    }

    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
      subscription = data.subscription;
    } catch (error) {
      console.error("Error setting up auth state change listener:", error);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, always use demo credentials
    const loginEmail = "demo@captivite.com";
    const loginPassword = "demo123";

    // Set a mock user for demo purposes
    const demoUser = {
      id: "demo-user-id",
      email: "demo@captivite.com",
      user_metadata: {
        full_name: "Demo User",
      },
    };

    setUser(demoUser);
    // Store in localStorage for persistence
    localStorage.setItem("captiviteUser", JSON.stringify(demoUser));
    return { error: null };
  };

  const logout = async () => {
    // Clear localStorage regardless of user type
    localStorage.removeItem("captiviteUser");
    setUser(null);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
