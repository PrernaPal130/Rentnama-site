"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  beginCustomerPhoneAuth,
  completeCustomerPhoneAuth,
  createVendorAccount,
  firebaseReady,
  getUserProfile,
  logoutUser,
  signInVendor,
  subscribeToAuth,
  updateCustomerProfile,
} from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);

      if (!user) {
        setProfile(null);
        setAuthLoading(false);
        return;
      }

      const nextProfile = await getUserProfile(user.uid);
      setProfile(nextProfile);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleCompleteCustomerPhoneAuth(
    confirmationResult,
    verificationCode,
    profileInput = {}
  ) {
    const user = await completeCustomerPhoneAuth(
      confirmationResult,
      verificationCode,
      profileInput
    );
    const nextProfile = await getUserProfile(user.uid);
    setProfile(nextProfile);
    return user;
  }

  async function handleUpdateCustomerProfile(uid, profileInput = {}) {
    const nextProfile = await updateCustomerProfile(uid, profileInput);
    setProfile(nextProfile);
    return nextProfile;
  }

  const value = useMemo(
    () => ({
      currentUser,
      profile,
      authLoading,
      firebaseReady,
      beginCustomerPhoneAuth,
      completeCustomerPhoneAuth: handleCompleteCustomerPhoneAuth,
      updateCustomerProfile: handleUpdateCustomerProfile,
      loginVendor: signInVendor,
      signupVendor: createVendorAccount,
      logout: logoutUser,
    }),
    [authLoading, currentUser, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthData() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthData must be used inside AuthProvider.");
  }

  return context;
}
