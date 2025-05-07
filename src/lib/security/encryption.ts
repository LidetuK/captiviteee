import { createCipheriv, createDecipheriv, randomBytes, Cipher, Decipher } from "crypto";

interface EncryptionResult {
  encrypted: string;
  iv: string;
  tag: string;
}

interface TLSConfig {
  cert?: string;
  key?: string;
  minVersion: string;
}

export const encryption = {
  algorithm: "aes-256-gcm",

  encrypt: (
    text: string,
    key: Buffer,
  ): EncryptionResult => {
    try {
      const iv = randomBytes(12);
      const cipher = createCipheriv(encryption.algorithm, key, iv) as Cipher & { getAuthTag(): Buffer };

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        encrypted,
        iv: iv.toString("hex"),
        tag: cipher.getAuthTag().toString("hex"),
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  decrypt: (
    encrypted: string,
    key: Buffer,
    iv: string,
    tag: string,
  ): string => {
    try {
      const decipher = createDecipheriv(
        encryption.algorithm,
        key,
        Buffer.from(iv, "hex"),
      ) as Decipher & { setAuthTag(tag: Buffer): void };

      decipher.setAuthTag(Buffer.from(tag, "hex"));

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Data at rest encryption
  encryptData: async (data: unknown): Promise<string> => {
    try {
      const key = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY) : randomBytes(32);
      const { encrypted, iv, tag } = encryption.encrypt(
        JSON.stringify(data),
        key,
      );
      return JSON.stringify({ encrypted, iv, tag });
    } catch (error) {
      throw new Error(`Data encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Data in transit encryption (TLS)
  configureTLS: (): TLSConfig => {
    return {
      cert: process.env.TLS_CERT,
      key: process.env.TLS_KEY,
      minVersion: "TLSv1.2",
    };
  },
};
