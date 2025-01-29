import * as React from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  JWT,
} from "aws-amplify/auth";

export interface AuthContext {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword(): unknown;
  user: JWT | undefined;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const checkUserSession = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user.username;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<JWT | undefined>(undefined);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () =>
    checkUserSession()
      .then(() => setIsAuthenticated(true))
      .then(() => fetchAuthSession())
      .then((session) => setUser(session?.tokens?.idToken))
      .catch(() => setIsAuthenticated(false))
      .then(() => setIsCheckingAuth(false));

  const logout = React.useCallback(async () => {
    setIsAuthenticated(false);
    await signOut();
    setIsAuthenticated(false);
    setUser(undefined);
  }, []);

  const login = React.useCallback(
    async (username: string, password: string) => {
      try {
        const signinUser = await signIn({ username, password });
        setIsAuthenticated(true);
        if (signinUser.isSignedIn) {
          const { idToken } = (await fetchAuthSession()).tokens ?? {};
          setUser(idToken);
        }
        return signinUser;
      } catch (error: any) {
        setIsAuthenticated(false);
        throw error;
      } finally {
      }
    },
    []
  );

  const resetPassword = async () => {
    alert(`TBD:: Reset password `);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCheckingAuth,
        user,
        login,
        logout,
        resetPassword,
      }}
    >
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
