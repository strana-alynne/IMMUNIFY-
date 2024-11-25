"use client"; // This allows hooks to work in Next.js

import { createContext, useContext } from "react";

const UserContext = createContext(null);

// Custom hook to access the user
export const useUser = () => useContext(UserContext);

// Provider component to wrap the app with user context
export const UserProvider = ({ value, children }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
