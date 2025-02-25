interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export const locationManager = {
  tracking: new Map<string, Location[]>(),
  listeners: new Set<(location: Location) => void>(),

  startTracking: (userId: string) => {
    // Start location tracking
    locationManager.tracking.set(userId, []);
    return { tracking: true };
  },

  stopTracking: (userId: string) => {
    // Stop location tracking
    locationManager.tracking.delete(userId);
    return { tracking: false };
  },

  updateLocation: (userId: string, location: Omit<Location, "timestamp">) => {
    const locations = locationManager.tracking.get(userId) || [];
    const newLocation: Location = {
      ...location,
      timestamp: new Date(),
    };

    locations.push(newLocation);
    locationManager.tracking.set(userId, locations);

    // Notify listeners
    locationManager.listeners.forEach((listener) => listener(newLocation));

    return newLocation;
  },

  getLocations: (userId: string) => {
    return locationManager.tracking.get(userId) || [];
  },

  addListener: (callback: (location: Location) => void) => {
    locationManager.listeners.add(callback);
    return () => locationManager.listeners.delete(callback);
  },
};
