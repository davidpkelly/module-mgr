import * as React from "react";
import { signIn, signOut, fetchAuthSession } from "aws-amplify/auth";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword(): unknown;
  user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "mm.auth.user";

function getStoredUser() {
  return localStorage.getItem(key);
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user);
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredUser());
  // const [user, setUser] = React.useState<string | null>(null);
  const isAuthenticated = !!user;

  const logout = React.useCallback(async () => {
    await signOut();
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = React.useCallback(
    async (username: string, password: string) => {
      try {
        await signIn({ username, password });
        setStoredUser(username);
        setUser(username);

        // const { username: uname, userId, signInDetails } = await getCurrentUser();
        // console.log("[getCurrentUser]:", { uname, userId, signInDetails });
        const session = await fetchAuthSession();
        console.log("[fetchAuthSession]:", session);


      } catch (error) {
        console.error("Failed to sign in:", error);
        throw error;
      } finally {
      }
    },
    []
  );

  const resetPassword = async () => {
    alert(`TBD:: Reset password `);
  }

  React.useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
