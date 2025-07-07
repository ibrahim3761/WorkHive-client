import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setLoading(false);
        })

        return () =>{
            unSubscribe();
        }
    },[])
  const authInfo ={
    user,
    loading,
    createUser,
    updateUserProfile
  }
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};
export default AuthProvider;
