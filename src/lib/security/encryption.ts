import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export const encryption = {
  algorithm: "aes-256-gcm",

  encrypt: (
    text: string,
    key: Buffer,
  ): { encrypted: string; iv: string; tag: string } => {
    const iv = randomBytes(12);
    const cipher = createCipheriv(encryption.algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      encrypted,
      iv: iv.toString("hex"),
      tag: cipher.getAuthTag().toString("hex"),
    };
  },

  decrypt: (
    encrypted: string,
    key: Buffer,
    iv: string,
    tag: string,
  ): string => {
    const decipher = createDecipheriv(
      encryption.algorithm,
      key,
      Buffer.from(iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(tag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  },

  // Data at rest encryption
  encryptData: async (data: any): Promise<string> => {
    const key = process.env.ENCRYPTION_KEY || randomBytes(32);
    const { encrypted, iv, tag } = encryption.encrypt(
      JSON.stringify(data),
      key,
    );
    return JSON.stringify({ encrypted, iv, tag });
  },

  // Data in transit encryption (TLS)
  configureTLS: () => {
    return {
      cert: process.env.TLS_CERT,
      key: process.env.TLS_KEY,
      minVersion: "TLSv1.2",
    };
  },
};
