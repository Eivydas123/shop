import React, { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const signUp = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };
  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };
  const logOut = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscrbe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      // console.log(user);
    });
    return unsubscrbe;
  }, []);

  const value = {
    currentUser,
    signUp,
    login,
    logOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
