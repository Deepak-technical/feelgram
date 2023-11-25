import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {  IUser } from "@/types";
import { getAccount, getCurrentUser } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";
import updateVerifiedUser from "@/lib/appwrite/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  emailVerified:false,
  following: [],
  followers: [],
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  console.log("curernt context",user)
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      const data=await getAccount();
      console.log("getAccount",data)
      setIsLoading(true);

      if (currentAccount && data) {
      
        const shouldUpdateEmailVerification = currentAccount.emailVerified === false && data.emailVerification === true;
      
        const updateUserData = {
          userId: currentAccount.$id,
          emailVerified: data.emailVerification
        };
      
        const updatedUser = await updateVerifiedUser(updateUserData);
      
        const updateMessage = updatedUser ? `Updated user: ${updatedUser}` : "User not updated";
      
        if (shouldUpdateEmailVerification) {
          console.log(updateMessage);
        } else {
          console.log("User already verified");
          // console.log(updateMessage);
        }
      
      
      
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
          emailVerified:currentAccount.emailVerified,
          following:currentAccount.following,
          followers:currentAccount.followers,
        });
        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null 
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
