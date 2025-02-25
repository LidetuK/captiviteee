interface License {
  id: string;
  key: string;
  type: "trial" | "standard" | "enterprise";
  features: string[];
  seats: number;
  expiryDate: Date;
  status: "active" | "expired" | "suspended";
}

export const licenseManager = {
  licenses: new Map<string, License>(),

  activateLicense: async (licenseKey: string) => {
    // Validate and activate license
    const license: License = {
      id: crypto.randomUUID(),
      key: licenseKey,
      type: "standard",
      features: ["basic", "advanced"],
      seats: 10,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: "active",
    };

    licenseManager.licenses.set(license.id, license);
    return license;
  },

  deactivateLicense: async (licenseId: string) => {
    const license = licenseManager.licenses.get(licenseId);
    if (!license) throw new Error("License not found");

    license.status = "suspended";
    licenseManager.licenses.set(licenseId, license);
    return license;
  },

  validateLicense: (licenseId: string) => {
    const license = licenseManager.licenses.get(licenseId);
    if (!license) return false;

    const now = new Date();
    if (now > license.expiryDate) {
      license.status = "expired";
      licenseManager.licenses.set(licenseId, license);
      return false;
    }

    return license.status === "active";
  },

  checkFeatureAccess: (licenseId: string, feature: string) => {
    const license = licenseManager.licenses.get(licenseId);
    if (!license || !licenseManager.validateLicense(licenseId)) return false;

    return license.features.includes(feature);
  },

  getRemainingSeats: (licenseId: string) => {
    const license = licenseManager.licenses.get(licenseId);
    if (!license) return 0;

    // Implement seat counting logic
    return license.seats;
  },
};
