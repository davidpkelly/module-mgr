import * as React from "react";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

// const key = "mm.auth.user";

// function getStoredUser() {
//   return localStorage.getItem(key);
// }

// function setStoredUser(user: string | null) {
//   if (user) {
//     localStorage.setItem(key, user);
//   } else {
//     localStorage.removeItem(key);
//   }
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = React.useState<string | null>(getStoredUser());
  const [user, setUser] = React.useState<string | null>(null);
  const isAuthenticated = !!user;

  const logout = React.useCallback(async () => {
    await signOut();
    // setStoredUser(null);
    setUser(null);
  }, []);

  const login = React.useCallback(
    async (username: string, password: string) => {
      await signIn({ username, password });
      // setStoredUser(username);
      setUser(username);
    },
    []
  );

  React.useEffect(() => {
    getCurrentUser().then(({ username, userId, signInDetails }) => {
      console.log("[getCurrentUser]", { username, userId, signInDetails });
      setUser(username);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
