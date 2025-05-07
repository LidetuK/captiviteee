import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auditLogger } from "./auth/audit";
import { mfaService, MFAMethod } from "./auth/mfa";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  mfaRequired: boolean;
  mfaVerified: boolean;
  lastActivity: Date | null;
  loginAttempts: number;
  lockedUntil: Date | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; requiresMfa?: boolean }>;
  verifyMfa: (method: MFAMethod | "backup", code: string) => Promise<boolean>;
  logout: () => void;
  updateLastActivity: () => void;
  checkSession: () => boolean;
}

// Maximum login attempts before locking the account
const MAX_LOGIN_ATTEMPTS = 5;

// Lock duration in minutes
const LOCK_DURATION_MINUTES = 15;

// Session timeout in minutes
const SESSION_TIMEOUT_MINUTES = 30;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      mfaRequired: false,
      mfaVerified: false,
      lastActivity: null,
      loginAttempts: 0,
      lockedUntil: null,

      login: async (credentials) => {
        const state = get();

        // Check if account is locked
        if (state.lockedUntil && new Date() < state.lockedUntil) {
          await auditLogger.log({
            userId: credentials.email,
            action: "login_attempt",
            resource: "auth",
            details: { reason: "account_locked" },
            status: "failure",
          });

          return { success: false };
        }

        // For demo purposes, auto-authenticate with any credentials
        if (credentials.email && credentials.password) {
          // In a real app, you would verify credentials with your backend
          const userId = credentials.email;

          // Check if MFA is required for this user
          const mfaConfig = mfaService.getConfig(userId);
          const requiresMfa = mfaConfig?.isEnabled || false;

          set({
            isAuthenticated: true,
            user: { id: userId, email: credentials.email },
            mfaRequired: requiresMfa,
            mfaVerified: false,
            lastActivity: new Date(),
            loginAttempts: 0,
            lockedUntil: null,
          });

          await auditLogger.log({
            userId,
            action: "login",
            resource: "auth",
            details: { method: "password", requiresMfa },
            status: "success",
          });

          return { success: true, requiresMfa };
        }

        // Increment login attempts on failure
        const newAttempts = state.loginAttempts + 1;
        let lockedUntil = state.lockedUntil;

        // Lock account if max attempts reached
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockTime = new Date();
          lockTime.setMinutes(lockTime.getMinutes() + LOCK_DURATION_MINUTES);
          lockedUntil = lockTime;

          await auditLogger.log({
            userId: credentials.email,
            action: "account_locked",
            resource: "auth",
            details: { attempts: newAttempts, duration: LOCK_DURATION_MINUTES },
            status: "warning",
          });
        }

        set({ loginAttempts: newAttempts, lockedUntil });

        await auditLogger.log({
          userId: credentials.email,
          action: "login_attempt",
          resource: "auth",
          details: { attempts: newAttempts },
          status: "failure",
        });

        return { success: false };
      },

      verifyMfa: async (method, code) => {
        const state = get();
        if (!state.user) return false;

        const result = await mfaService.verify(state.user.id, method, code);

        if (result.success) {
          set({ mfaVerified: true, lastActivity: new Date() });
          return true;
        }

        return false;
      },

      logout: () => {
        const state = get();
        const userId = state.user?.id;

        set({
          isAuthenticated: false,
          user: null,
          mfaRequired: false,
          mfaVerified: false,
          lastActivity: null,
        });

        if (userId) {
          auditLogger.log({
            userId,
            action: "logout",
            resource: "auth",
            status: "success",
          });
        }
      },

      updateLastActivity: () => {
        set({ lastActivity: new Date() });
      },

      checkSession: () => {
        const state = get();

        // Not authenticated
        if (!state.isAuthenticated || !state.user) {
          return false;
        }

        // MFA required but not verified
        if (state.mfaRequired && !state.mfaVerified) {
          return false;
        }

        // Check session timeout
        if (state.lastActivity) {
          const now = new Date();
          const lastActivity = new Date(state.lastActivity);
          const diffMinutes =
            (now.getTime() - lastActivity.getTime()) / (1000 * 60);

          if (diffMinutes > SESSION_TIMEOUT_MINUTES) {
            // Session expired, log the user out
            get().logout();
            return false;
          }
        }

        // Update last activity
        set({ lastActivity: new Date() });
        return true;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        mfaRequired: state.mfaRequired,
        mfaVerified: state.mfaVerified,
        lastActivity: state.lastActivity,
        loginAttempts: state.loginAttempts,
        lockedUntil: state.lockedUntil,
      }),
    }
  )
);
