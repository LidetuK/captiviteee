interface APIVersion {
  version: string;
  endpoints: {
    path: string;
    methods: string[];
    handler: Function;
    deprecated?: boolean;
  }[];
  deprecated?: boolean;
}

export const versionManager = {
  versions: new Map<string, APIVersion>(),

  registerVersion: (version: APIVersion) => {
    versionManager.versions.set(version.version, version);
    return version;
  },

  getHandler: (version: string, path: string, method: string) => {
    const apiVersion = versionManager.versions.get(version);
    if (!apiVersion) return null;

    const endpoint = apiVersion.endpoints.find(
      (e) => e.path === path && e.methods.includes(method),
    );

    return endpoint?.handler || null;
  },

  isDeprecated: (version: string) => {
    const apiVersion = versionManager.versions.get(version);
    return apiVersion?.deprecated || false;
  },

  getLatestVersion: () => {
    const versions = Array.from(versionManager.versions.keys());
    return versions.sort().pop() || "v1";
  },

  migrateEndpoint: async (
    fromVersion: string,
    toVersion: string,
    path: string,
  ) => {
    const sourceVersion = versionManager.versions.get(fromVersion);
    const targetVersion = versionManager.versions.get(toVersion);

    if (!sourceVersion || !targetVersion) return false;

    const endpoint = sourceVersion.endpoints.find((e) => e.path === path);
    if (!endpoint) return false;

    // Mark as deprecated in old version
    endpoint.deprecated = true;

    // Add to new version
    targetVersion.endpoints.push({
      ...endpoint,
      deprecated: false,
    });

    return true;
  },
};
