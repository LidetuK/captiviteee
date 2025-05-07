/**
 * Multi-Factor Authentication (MFA) system
 */

import { auditLogger } from "./audit";

export type MFAMethod = "authenticator" | "email" | "sms";

export interface MFAConfig {
  userId: string;
  isEnabled: boolean;
  preferredMethod: MFAMethod;
  methods: {
    authenticator?: {
      secret?: string;
      verified: boolean;
    };
    email?: {
      email: string;
      verified: boolean;
    };
    sms?: {
      phoneNumber: string;
      verified: boolean;
    };
  };
  backupCodes?: string[];
  lastVerified?: Date;
}

export interface MFAVerificationResult {
  success: boolean;
  message: string;
  expiresAt?: Date;
}

class MFAService {
  private configs = new Map<string, MFAConfig>();
  private verificationCache = new Map<string, { expiresAt: Date }>();
  private storageKey = "captivite_mfa_configs";

  constructor() {
    // Load MFA configs from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedConfigs = localStorage.getItem(this.storageKey);
        if (storedConfigs) {
          const parsedConfigs = JSON.parse(storedConfigs);
          Object.entries(parsedConfigs).forEach(
            ([userId, config]: [string, any]) => {
              // Convert string timestamps back to Date objects
              if (config.lastVerified) {
                config.lastVerified = new Date(config.lastVerified);
              }
              this.configs.set(userId, config as MFAConfig);
            },
          );
        }
      } catch (error) {
        console.error("Failed to load MFA configs from storage:", error);
      }
    }
  }

  /**
   * Get MFA configuration for a user
   */
  getConfig(userId: string): MFAConfig | undefined {
    return this.configs.get(userId);
  }

  /**
   * Initialize MFA for a user
   */
  async setupMFA(userId: string, method: MFAMethod): Promise<MFAConfig> {
    let config = this.configs.get(userId);

    if (!config) {
      config = {
        userId,
        isEnabled: false,
        preferredMethod: method,
        methods: {},
      };
    }

    // Initialize the selected method
    switch (method) {
      case "authenticator":
        config.methods.authenticator = {
          secret: this.generateAuthenticatorSecret(),
          verified: false,
        };
        break;
      case "email":
        // In a real implementation, we would get the email from the user profile
        config.methods.email = {
          email: "user@example.com",
          verified: false,
        };
        break;
      case "sms":
        // In a real implementation, we would get the phone number from the user profile
        config.methods.sms = {
          phoneNumber: "+1234567890",
          verified: false,
        };
        break;
    }

    this.configs.set(userId, config);
    this.persistConfigs();

    await auditLogger.log({
      userId,
      action: "mfa_setup_initiated",
      resource: "auth",
      details: { method },
    });

    return config;
  }

  /**
   * Verify MFA setup
   */
  async verifySetup(
    userId: string,
    method: MFAMethod,
    code: string,
  ): Promise<boolean> {
    const config = this.configs.get(userId);
    if (!config) return false;

    let success = false;

    // Verify the code based on the method
    switch (method) {
      case "authenticator":
        if (config.methods.authenticator) {
          // In a real implementation, we would verify the TOTP code
          success = code === "123456"; // Dummy verification
          if (success) {
            config.methods.authenticator.verified = true;
          }
        }
        break;
      case "email":
        if (config.methods.email) {
          // In a real implementation, we would verify the email code
          success = code === "123456"; // Dummy verification
          if (success) {
            config.methods.email.verified = true;
          }
        }
        break;
      case "sms":
        if (config.methods.sms) {
          // In a real implementation, we would verify the SMS code
          success = code === "123456"; // Dummy verification
          if (success) {
            config.methods.sms.verified = true;
          }
        }
        break;
    }

    if (success) {
      // Enable MFA if at least one method is verified
      const hasVerifiedMethod = Object.values(config.methods).some(
        (m) => m.verified,
      );
      if (hasVerifiedMethod) {
        config.isEnabled = true;
        config.preferredMethod = method;
      }

      // Generate backup codes if not already present
      if (!config.backupCodes || config.backupCodes.length === 0) {
        config.backupCodes = this.generateBackupCodes();
      }

      this.configs.set(userId, config);
      this.persistConfigs();

      await auditLogger.log({
        userId,
        action: "mfa_setup_completed",
        resource: "auth",
        details: { method },
        status: "success",
      });
    } else {
      await auditLogger.log({
        userId,
        action: "mfa_setup_failed",
        resource: "auth",
        details: { method },
        status: "failure",
      });
    }

    return success;
  }

  /**
   * Verify MFA during login
   */
  async verify(
    userId: string,
    method: MFAMethod | "backup",
    code: string,
  ): Promise<MFAVerificationResult> {
    const config = this.configs.get(userId);
    if (!config || !config.isEnabled) {
      return { success: false, message: "MFA not enabled for this user" };
    }

    let success = false;

    if (method === "backup") {
      // Verify backup code
      if (config.backupCodes && config.backupCodes.includes(code)) {
        // Remove the used backup code
        config.backupCodes = config.backupCodes.filter((c) => c !== code);
        success = true;
      }
    } else {
      // Verify the code based on the method
      switch (method) {
        case "authenticator":
          if (config.methods.authenticator?.verified) {
            // In a real implementation, we would verify the TOTP code
            success = code === "123456"; // Dummy verification
          }
          break;
        case "email":
          if (config.methods.email?.verified) {
            // In a real implementation, we would verify the email code
            success = code === "123456"; // Dummy verification
          }
          break;
        case "sms":
          if (config.methods.sms?.verified) {
            // In a real implementation, we would verify the SMS code
            success = code === "123456"; // Dummy verification
          }
          break;
      }
    }

    if (success) {
      // Update last verified timestamp
      config.lastVerified = new Date();
      this.configs.set(userId, config);
      this.persistConfigs();

      // Cache the verification for the session
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour verification window
      this.verificationCache.set(userId, { expiresAt });

      await auditLogger.log({
        userId,
        action: "mfa_verification",
        resource: "auth",
        details: { method },
        status: "success",
      });

      return {
        success: true,
        message: "MFA verification successful",
        expiresAt,
      };
    }

    await auditLogger.log({
      userId,
      action: "mfa_verification",
      resource: "auth",
      details: { method },
      status: "failure",
    });

    return { success: false, message: "Invalid verification code" };
  }

  /**
   * Check if a user has completed MFA verification for the current session
   */
  isVerified(userId: string): boolean {
    const cached = this.verificationCache.get(userId);
    if (cached && cached.expiresAt > new Date()) {
      return true;
    }
    return false;
  }

  /**
   * Disable MFA for a user
   */
  async disableMFA(userId: string): Promise<boolean> {
    const config = this.configs.get(userId);
    if (!config) return false;

    config.isEnabled = false;
    this.configs.set(userId, config);
    this.persistConfigs();
    this.verificationCache.delete(userId);

    await auditLogger.log({
      userId,
      action: "mfa_disabled",
      resource: "auth",
      status: "success",
    });

    return true;
  }

  /**
   * Generate a new set of backup codes
   */
  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate a random 8-character code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Generate a secret key for authenticator apps
   */
  private generateAuthenticatorSecret(): string {
    // In a real implementation, we would use a proper TOTP library
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; // Dummy secret
  }

  /**
   * Persist MFA configurations to localStorage
   */
  private persistConfigs(): void {
    if (typeof window !== "undefined") {
      try {
        const configsObj = Object.fromEntries(this.configs.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(configsObj));
      } catch (error) {
        console.error("Failed to store MFA configs:", error);
      }
    }
  }
}

export const mfaService = new MFAService();
