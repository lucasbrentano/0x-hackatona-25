// src/routes/AuthContext.tsx

import React, { createContext, useState, useEffect } from "react";
import { AuthContextData, SignInData } from "./types";
import { getItem, setItem, deleteItem } from "./auth-storage";

export const AuthContext = createContext<AuthContextData>({
  token: null,
  refreshToken: null,
  expiresAt: null,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    async function loadAuth() {
      const storedToken = await getItem("authToken");
      const storedRefresh = await getItem("refreshToken");
      const storedExpiry = await getItem("tokenExpiry");
      const storedAdmin = await getItem("isAdmin");

      setToken(storedToken);
      setRefreshToken(storedRefresh);
      setExpiresAt(storedExpiry ? Number(storedExpiry) : null);
      setIsAdmin(storedAdmin === "true");
      setAuthLoaded(true);
    }

    loadAuth();
  }, []);

  const signIn = async ({ token, refreshToken, expiresIn, isAdmin }: SignInData) => {
    const expiryTimestamp = Date.now() + expiresIn;
    await setItem("authToken", token);
    await setItem("refreshToken", refreshToken);
    await setItem("tokenExpiry", expiryTimestamp.toString());
    await setItem("isAdmin", isAdmin ? "true" : "false");

    setToken(token);
    setRefreshToken(refreshToken);
    setExpiresAt(expiryTimestamp);
    setIsAdmin(isAdmin);
  };

  const signOut = async () => {
    await deleteItem("authToken");
    await deleteItem("refreshToken");
    await deleteItem("tokenExpiry");
    await deleteItem("isAdmin");

    setToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    setIsAdmin(false);
  };

  if (!authLoaded) {
    return null; // Ou um loading spinner
  }

  return (
    <AuthContext.Provider value={{ token, refreshToken, expiresAt, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
