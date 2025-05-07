import { create } from "zustand";
import * as React from "react";
import { createContext, useContext, useRef } from "react";

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create the store
const createLoadingStore = () =>
  create<LoadingState>((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
  }));

// Create a context for the store
type LoadingStoreType = ReturnType<typeof createLoadingStore>;
const LoadingStoreContext = createContext<LoadingStoreType | null>(null);

// Create a provider component
export const LoadingStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<LoadingStoreType>();
  if (!storeRef.current) {
    storeRef.current = createLoadingStore();
  }
  // Using createElement instead of JSX to avoid SWC parsing issues
  return React.createElement(
    LoadingStoreContext.Provider,
    { value: storeRef.current as LoadingStoreType },
    children,
  );
};

// Hook to use the store
export const useLoading = <T>(selector: (state: LoadingState) => T): T => {
  const store = useContext(LoadingStoreContext);
  if (!store) throw new Error("Missing LoadingStoreProvider in the tree");
  return store(selector);
};
