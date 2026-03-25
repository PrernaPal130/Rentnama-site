"use client";

import { createContext, useContext } from "react";

const AppDataContext = createContext(null);

export function AppDataProvider({ value, children }) {
  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside MyState.");
  }

  return context;
}
